import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import BookPage from "./pages/BookPage";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import PageNotFound from "./pages/PageNotFound";
import CustomerDebtPage from "./pages/CustomerDebtPage";
import CustomerListPage from "./pages/CustomerPage";
import ReportPage from "./pages/ReportPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { settingsService } from "./services/settingsService";
import { AuthProvider } from "./context/AuthContext";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
function App() {
    
    const [rules, setRules] = useState({
        MinImportQuantity: 150,
        MinStockPreImport: 300,
        MinStockPostSell: 20,
        MaxDebt: 20000,
        CheckDebtRule: true,
    })
    const [rulesLoading, setRulesLoading] = useState(false);

     // Load rules on app mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadRules();
        }
    }, []);

    const loadRules = async () => {
        try {
            setRulesLoading(true);
            const data = await settingsService.getRules();
            setRules(data);
        } catch (err) {
            console.error("Failed to load rules:", err);
        } finally {
            setRulesLoading(false);
        }
    };

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'NhanVien']} />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/book" element={<BookPage />} />
                        <Route path="/sale" element={<SalesPage />} />
                        <Route path="/inventory" element={<InventoryPage rules={rules}  />} />
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
