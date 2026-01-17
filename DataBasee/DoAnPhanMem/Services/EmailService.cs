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
                smtp.Timeout = 15000; 
                smtp.CheckCertificateRevocation = false;
                smtp.ServerCertificateValidationCallback = (s, c, h, e) => true; // Bypass all cert errors (for IP connection)

                var port = int.Parse(emailSettings["Port"]);
                var host = emailSettings["SmtpServer"];

                // Force IPv4 Resolution
                var addresses = await System.Net.Dns.GetHostAddressesAsync(host);
                var ipAddress = addresses.FirstOrDefault(a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
                var connectHost = ipAddress?.ToString() ?? host;

                Console.WriteLine($"[Email] Resolved {host} -> {connectHost}. Connecting to {port}..."); 
                
                var options = port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
                
                await smtp.ConnectAsync(connectHost, port, options);
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
