using System.Threading.Tasks;

namespace DoAnPhanMem.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }
}
