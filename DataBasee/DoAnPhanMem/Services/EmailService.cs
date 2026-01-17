using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailSettings = _config.GetSection("EmailSettings");

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = message;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try 
            {
                smtp.Timeout = 20000; // Increase to 20s
                var port = int.Parse(emailSettings["Port"]);
                var options = port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
                
                await smtp.ConnectAsync(emailSettings["SmtpServer"], port, options);
                await smtp.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);
                await smtp.SendAsync(email);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
