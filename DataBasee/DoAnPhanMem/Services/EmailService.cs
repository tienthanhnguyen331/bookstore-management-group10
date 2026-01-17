using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;

namespace DoAnPhanMem.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly string _sendGridKey;

        public EmailService(IConfiguration config)
        {
            _config = config;
            // Key MUST come from Environment Variable "SendGridKey" to pass GitHub Security
            _sendGridKey = _config["SendGridKey"] ?? throw new Exception("SendGridKey not found in Config!"); 
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var folderSettings = _config.GetSection("EmailSettings");
            var fromEmail = folderSettings["SenderEmail"] ?? "nguyentienthanh7298@gmail.com"; 
            var fromName = folderSettings["SenderName"] ?? "BookStore Support";

            var client = new SendGridClient(_sendGridKey);
            var from = new EmailAddress(fromEmail, fromName);
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", message);
            
            Console.WriteLine($"[SendGrid] Sending to {toEmail} from {fromEmail}...");
            var response = await client.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("[SendGrid] Email sent successfully!");
            }
            else
            {
                var body = await response.Body.ReadAsStringAsync();
                Console.WriteLine($"[SendGrid] FAILED. Status: {response.StatusCode}. Body: {body}");
                throw new Exception($"SendGrid Error: {response.StatusCode} - {body}");
            }
        }
    }
}
