namespace DoAnPhanMem.DTO
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsFirstLogin { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string MaNV { get; set; } = string.Empty;
    }
}
