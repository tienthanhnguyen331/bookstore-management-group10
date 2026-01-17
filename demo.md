# Kế hoạch Phân quyền & Quản lý Nhân viên (Demo)

Tài liệu này mô tả các bước cần thiết và mã nguồn mẫu (mock data) để thực hiện tính năng phân quyền (RBAC) và quản lý nhân viên cho dự án Bookstore.

## 1. Database (Cơ sở dữ liệu)

### Kiểm tra & Cập nhật
*   **Bảng `NHAN_VIEN`**: Đảm bảo cột `ChucVu` tồn tại.
    *   Giá trị: `'Admin'` (Quản lý), `'NhanVien'` (Nhân viên bán hàng/kho).
*   **Bảng `TAI_KHOAN`**:
    *   Không cần thêm cột mới.
    *   **Logic xác định lần đầu đăng nhập**: Kiểm tra nếu mật khẩu hiện tại khớp với mã hóa của chuỗi `"1"` (mật khẩu mặc định).

---

## 2. Backend (.NET API)

### 2.1. Cập nhật `AuthService.cs` (Login)

Sửa hàm `Login` để trả về thông tin Role và trạng thái mật khẩu.

```csharp
// DTO phản hồi Login
public class LoginResponseDto
{
    public string Token { get; set; }
    public string Role { get; set; } // "Admin" hoặc "NhanVien"
    public bool IsFirstLogin { get; set; } // True nếu pass == "1"
}

// Trong AuthService.cs
public async Task<LoginResponseDto> Login(string username, string password)
{
    var user = await _context.TAI_KHOAN.Include(t => t.NhanVien).FirstOrDefaultAsync(x => x.TenDangNhap == username);
    
    if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.MatKhau))
        throw new Exception("Sai tài khoản hoặc mật khẩu");

    // Kiểm tra mật khẩu mặc định (giả sử "1" hash ra chuỗi X)
    // Hoặc đơn giản là check lại: BCrypt.Verify("1", user.MatKhau)
    bool isFirstLogin = BCrypt.Net.BCrypt.Verify("1", user.MatKhau);

    var role = user.NhanVien?.ChucVu ?? "NhanVien";

    var token = GenerateJwt(user, role); // Thêm role vào claim

    return new LoginResponseDto 
    { 
        Token = token, 
        Role = role, 
        IsFirstLogin = isFirstLogin 
    };
}
```

### 2.2. API Đổi mật khẩu (`AuthController.cs`)

```csharp
[HttpPost("change-password")]
[Authorize] // Yêu cầu đã đăng nhập
public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
{
    var username = User.Identity.Name;
    // Logic: Tìm user, verify mật khẩu cũ, hash mật khẩu mới, lưu lại
    // ...
    return Ok(new { message = "Đổi mật khẩu thành công" });
}
```

### 2.3. API Tạo nhân viên (`EmployeeController.cs`)

```csharp
// DTOs
public class CreateEmployeeDto
{
    public string HoTen { get; set; }
    public string SDT { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; } // Mật khẩu khởi tạo
}

public class UpdateEmployeeDto
{
    public string HoTen { get; set; }
    public string SDT { get; set; }
    public string Email { get; set; }
    public string ChucVu { get; set; }
}

[Route("api/employees")]
[ApiController]
[Authorize(Roles = "Admin")] // Toàn bộ controller chỉ dành cho Admin
public class EmployeeController : ControllerBase
{
    private readonly BookstoreContext _context;

    public EmployeeController(BookstoreContext context)
    {
        _context = context;
    }

    // GET: api/employees
    [HttpGet]
    public async Task<IActionResult> GetAllEmployees()
    {
        var list = await _context.NHAN_VIEN
            .Include(nv => nv.TaiKhoan)
            .Select(nv => new 
            {
                nv.MaNV,
                nv.HoTen,
                nv.SDT,
                nv.Email,
                nv.ChucVu,
                Username = nv.TaiKhoan != null ? nv.TaiKhoan.TenDangNhap : "Chưa có TK"
            })
            .ToListAsync();
        return Ok(list);
    }

    // POST: api/employees/create
    [HttpPost("create")]
    public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto)
    {
        // Validate: Check if Username exists
        if (await _context.TAI_KHOAN.AnyAsync(u => u.TenDangNhap == dto.Username))
        {
            return BadRequest("Tên đăng nhập đã tồn tại");
        }

        using var transaction = _context.Database.BeginTransaction();
        try 
        {
            // 1. Tạo NHAN_VIEN
            var nv = new NhanVien
            {
                MaNV = "NV" + DateTime.Now.Ticks, // Logic sinh mã tự động tốt hơn nên xử lý riêng
                HoTen = dto.HoTen,
                SDT = dto.SDT,
                Email = dto.Email,
                ChucVu = "NhanVien"
            };
            _context.NHAN_VIEN.Add(nv);
            await _context.SaveChangesAsync();

            // 2. Tạo TAI_KHOAN
            var tk = new TaiKhoan
            {
                TenDangNhap = dto.Username,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.Password), // Hash mật khẩu khởi tạo
                MaNV = nv.MaNV
            };
            _context.TAI_KHOAN.Add(tk);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return Ok(new { message = "Tạo nhân viên thành công" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Lỗi server: " + ex.Message);
        }
    }

    // PUT: api/employees/{maNV}
    [HttpPut("{maNV}")]
    public async Task<IActionResult> UpdateEmployee(string maNV, [FromBody] UpdateEmployeeDto dto)
    {
        var nv = await _context.NHAN_VIEN.FindAsync(maNV);
        if (nv == null) return NotFound();

        nv.HoTen = dto.HoTen;
        nv.SDT = dto.SDT;
        nv.Email = dto.Email;
        nv.ChucVu = dto.ChucVu;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công" });
    }

    // DELETE: api/employees/{maNV}
    [HttpDelete("{maNV}")]
    public async Task<IActionResult> DeleteEmployee(string maNV)
    {
        var nv = await _context.NHAN_VIEN.FindAsync(maNV);
        if (nv == null) return NotFound();

        // Xóa tài khoản liên quan trước (nếu không có Cascade Delete)
        var tk = await _context.TAI_KHOAN.FirstOrDefaultAsync(t => t.MaNV == maNV);
        if (tk != null) _context.TAI_KHOAN.Remove(tk);

        _context.NHAN_VIEN.Remove(nv);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa nhân viên thành công" });
    }

    // POST: api/employees/reset-password/{maNV}
    [HttpPost("reset-password/{maNV}")]
    public async Task<IActionResult> ResetPassword(string maNV)
    {
        var tk = await _context.TAI_KHOAN.FirstOrDefaultAsync(t => t.MaNV == maNV);
        if (tk == null) return NotFound("Nhân viên chưa có tài khoản");

        tk.MatKhau = BCrypt.Net.BCrypt.HashPassword("1"); // Reset về mặc định
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã reset mật khẩu về mặc định" });
    }
}
```

### 2.5. API Cá nhân (`ProfileController.cs`)

Dành cho nhân viên tự quản lý thông tin của mình.

```csharp
[Route("api/profile")]
[ApiController]
[Authorize] // Ai đăng nhập cũng dùng được
public class ProfileController : ControllerBase
{
    // Lấy thông tin bản thân
    [HttpGet]
    public async Task<IActionResult> GetMyProfile()
    {
        var username = User.Identity.Name;
        // Trả về thông tin nhân viên tương ứng
        return Ok();
    }

    // Tự cập nhật thông tin (SĐT, Địa chỉ...)
    [HttpPut]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
    {
        // ...
        return Ok();
    }
}
```

### 2.6. Bảo vệ API Báo cáo & Cài đặt

Thêm Attribute `[Authorize(Roles = "Admin")]` vào các Controller nhạy cảm.

```csharp
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase { ... }

[Authorize(Roles = "Admin")]
public class QuyDinhController : ControllerBase { ... }

### 2.7. Xử lý Quên Mật khẩu (Forgot Password)

Quy trình xử lý quên mật khẩu thông qua Email và OTP. Đây là quy trình chuẩn để đảm bảo bảo mật: người dùng phải truy cập được email đã đăng ký để nhận mã xác thực.

**Logic hoạt động:**
1.  **Yêu cầu OTP (Bước 1):**
    *   Người dùng nhập Email vào form.
    *   Hệ thống kiểm tra Email có tồn tại trong bảng `NHAN_VIEN` không.
    *   Nếu có, hệ thống sinh mã OTP (6 số ngẫu nhiên), lưu vào Database (kèm thời gian hết hạn, ví dụ 5 phút).
    *   Hệ thống gửi Email chứa mã OTP đến địa chỉ email vừa nhập.
    *   *Lưu ý:* API luôn trả về thông báo thành công "Nếu email tồn tại, mã OTP sẽ được gửi" để tránh việc kẻ xấu dò tìm email (User Enumeration Attack), hoặc trả về lỗi cụ thể nếu là hệ thống nội bộ ít rủi ro.

2.  **Đặt lại mật khẩu (Bước 2):**
    *   Người dùng nhập Email, mã OTP vừa nhận được, và Mật khẩu mới.
    *   Hệ thống kiểm tra:
        *   Email có đúng không?
        *   Mã OTP có khớp với mã trong Database không?
        *   Mã OTP còn hạn không?
    *   Nếu tất cả hợp lệ: Hash mật khẩu mới -> Cập nhật vào Database -> Xóa mã OTP -> Thông báo thành công.

**Cập nhật `AuthController.cs`:**

```csharp
// DTOs
public class ForgotPasswordDto
{
    public string Email { get; set; }
}

public class ResetPasswordDto
{
    public string Email { get; set; }
    public string Otp { get; set; }
    public string NewPassword { get; set; }
}

[HttpPost("forgot-password")]
[AllowAnonymous]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
{
    // 1. Kiểm tra Email có tồn tại trong hệ thống không
    var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(nv => nv.Email == dto.Email);
    if (nhanVien == null) 
    {
        // Để bảo mật, có thể trả về Ok ngay cả khi không tìm thấy email (tránh dò user).
        // Tuy nhiên với phần mềm nội bộ, có thể báo lỗi rõ ràng:
        return BadRequest("Email không tồn tại trong hệ thống");
    }

    // 2. Tạo OTP (Random 6 số)
    var otp = new Random().Next(100000, 999999).ToString();
    
    // 3. Lưu OTP vào Database
    // Cần đảm bảo bảng TAI_KHOAN hoặc bảng riêng (OTP_LOG) có các cột lưu trữ này.
    var taiKhoan = await _context.TAI_KHOAN.FirstOrDefaultAsync(t => t.MaNV == nhanVien.MaNV);
    if (taiKhoan == null) return BadRequest("Nhân viên này chưa có tài khoản");

    taiKhoan.OtpCode = otp;
    taiKhoan.OtpExpiry = DateTime.Now.AddMinutes(5); // Hết hạn sau 5 phút
    await _context.SaveChangesAsync();

    // 4. Gửi Email (Sử dụng dịch vụ Email Service - cần cấu hình SMTP)
    // await _emailService.SendEmailAsync(dto.Email, "Mã xác thực Quên mật khẩu", $"Mã OTP của bạn là: {otp}");

    return Ok(new { message = "Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư." });
}

[HttpPost("reset-password-otp")]
[AllowAnonymous]
public async Task<IActionResult> ResetPasswordWithOtp([FromBody] ResetPasswordDto dto)
{
    // 1. Tìm nhân viên theo Email
    var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(nv => nv.Email == dto.Email);
    if (nhanVien == null) return BadRequest("Email không hợp lệ");

    var taiKhoan = await _context.TAI_KHOAN.FirstOrDefaultAsync(t => t.MaNV == nhanVien.MaNV);

    // 2. Kiểm tra OTP
    if (taiKhoan.OtpCode != dto.Otp) return BadRequest("Mã OTP không chính xác");
    if (taiKhoan.OtpExpiry < DateTime.Now) return BadRequest("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");

    // 3. Đổi mật khẩu
    taiKhoan.MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    
    // 4. Xóa OTP sau khi dùng để ngăn chặn dùng lại (Replay Attack)
    taiKhoan.OtpCode = null;
    taiKhoan.OtpExpiry = null;
    
    await _context.SaveChangesAsync();

    return Ok(new { message = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
}
```
```

---

## 3. Frontend (ReactJS) - Chi tiết Chức năng Đăng nhập & Phân quyền

> **Lưu ý:** Dưới đây là mã nguồn chuẩn để kết nối với Backend API. Mã nguồn thực tế trong dự án hiện tại đang sử dụng Mock Data để demo tạm thời.

### 3.1. `AuthContext.jsx` (Quản lý Trạng thái Đăng nhập)

File này quản lý state `user` toàn cục và gọi API đăng nhập.

```jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Axios instance đã cấu hình

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (username, password) => {
        try {
            // Gọi API Login thực tế
            const res = await api.post('/auth/login', { username, password });
            const { token, role, name } = res.data;
            
            const userData = { username, name, role, token };
            setUser(userData);
            
            // Lưu token và user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

### 3.2. `LoginPage.jsx` (Giao diện Đăng nhập)

Trang đăng nhập với xử lý lỗi và điều hướng về trang trước đó sau khi login thành công.

```jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu');
            return;
        }

        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* ... UI Code (Giữ nguyên như hiện tại) ... */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đăng nhập hệ thống
                </h2>
            </div>
            {/* ... Form inputs ... */}
        </div>
    );
}

export default LoginPage;
```

### 3.3. `ProtectedRoute.jsx` (Bảo vệ Route)

Component này kiểm tra xem user đã đăng nhập chưa và có quyền truy cập route đó không.

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login page but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have permission
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
```

### 3.4. `App.jsx` (Cấu hình Routing)

Phân chia các route thành Public, Protected (chung), và Admin Only.

```jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// ... imports pages
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
    // ... state rules

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Routes (Admin & Staff) */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'NhanVien']} />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/book" element={<BookPage />} />
                        <Route path="/sale" element={<SalesPage />} />
                        <Route path="/inventory" element={<InventoryPage rules={rules} rulesLoading={rulesLoading} />} />
                        <Route path="/finance" element={<CustomerDebtPage rules={rules} />} />
                        <Route path="/customer" element={<CustomerListPage />} />
                    </Route>

                    {/* Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/report" element={<ReportPage />} />
                        <Route path="/setting" element={<SettingsPage rules={rules} setRules={setRules} onRulesUpdate={loadRules} />} />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

### 3.5. `UserProfile.jsx` (Menu User & Đăng xuất)

Hiển thị thông tin user và nút đăng xuất.

```jsx
import { User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="...">
                {/* ... UI hiển thị tên user ... */}
                <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                </div>
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {/* ... */}
                    <div className="p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
```

### 3.7. `EmployeeManager.jsx` (Component quản lý nhân viên)

```jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newEmp, setNewEmp] = useState({ hoTen: '', sdt: '', email: '', username: '', password: '' });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error("Failed to load employees");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employees/create', newEmp);
            alert('Tạo nhân viên thành công!');
            setShowForm(false);
            setNewEmp({ hoTen: '', sdt: '', email: '', username: '', password: '' });
            loadEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi tạo nhân viên');
        }
    };

    return (
        <div>
            {/* UI Danh sách & Form (Tương tự bản Mock nhưng gọi API thật) */}
        </div>
    );
};

export default EmployeeManager;
```

### 3.8. Giao diện Quên Mật khẩu (`ForgotPasswordPage.jsx`)

Trang này cho phép người dùng nhập Email để nhận OTP và sau đó nhập OTP để đổi mật khẩu.

**Logic hoạt động:**
1.  **Giao diện:** Chia làm 2 bước (Step).
    *   **Step 1:** Form nhập Email.
    *   **Step 2:** Form nhập OTP và Mật khẩu mới.
2.  **Xử lý:**
    *   Khi người dùng bấm "Gửi mã OTP", gọi API `/auth/forgot-password`.
    *   Nếu thành công, chuyển sang Step 2 và hiện thông báo "Vui lòng kiểm tra email". **Tuyệt đối không hiển thị mã OTP lên màn hình** (để đảm bảo chỉ người sở hữu email mới biết mã).
    *   Khi người dùng nhập OTP và bấm "Đặt lại mật khẩu", gọi API `/auth/reset-password-otp`.
    *   Nếu thành công, chuyển hướng về trang Login.

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Pass mới
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            // Gọi API gửi OTP
            await api.post('/auth/forgot-password', { email });
            
            setStep(2);
            // Thông báo hướng dẫn người dùng kiểm tra email
            setMessage(`Mã xác thực đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư.`);
        } catch (err) {
            // Xử lý lỗi (ví dụ: Email không tồn tại)
            setError(err.response?.data || 'Không thể gửi OTP. Vui lòng kiểm tra lại email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Gọi API xác thực OTP và đổi mật khẩu
            await api.post('/auth/reset-password-otp', { email, otp, newPassword });
            
            alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Đổi mật khẩu thất bại. Mã OTP có thể không đúng hoặc đã hết hạn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center"><Logo /></div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Quên mật khẩu
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Khôi phục quyền truy cập
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm text-center rounded border border-red-200">{error}</div>}
                    {message && <div className="mb-4 p-2 bg-green-50 text-green-600 text-sm text-center rounded border border-green-200">{message}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email đăng ký</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="nhanvien@bookstore.com"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={email} disabled className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã OTP</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nhập mã OTP từ email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                            </button>
                        </form>
                    )}
                    
                    <div className="mt-6 text-center">
                        <a href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Quay lại đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
```
