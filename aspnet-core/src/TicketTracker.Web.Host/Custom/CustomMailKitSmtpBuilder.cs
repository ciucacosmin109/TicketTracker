
using Abp.Dependency;
using Abp.MailKit;
using Abp.Net.Mail.Smtp;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace TicketTracker.Web.Host.Custom {
    public class CustomMailKitSmtpBuilder : DefaultMailKitSmtpBuilder {
        private readonly ISmtpEmailSenderConfiguration _smtpEmailSenderConfiguration;
        private readonly IAbpMailKitConfiguration _abpMailKitConfiguration;

        public CustomMailKitSmtpBuilder(ISmtpEmailSenderConfiguration smtpEmailSenderConfiguration, IAbpMailKitConfiguration abpMailKitConfiguration) 
            : base(smtpEmailSenderConfiguration, abpMailKitConfiguration){

            _smtpEmailSenderConfiguration = smtpEmailSenderConfiguration;
            _abpMailKitConfiguration = abpMailKitConfiguration;
        }

        protected override void ConfigureClient(SmtpClient client) {
            client.Connect(
                _smtpEmailSenderConfiguration.Host,
                _smtpEmailSenderConfiguration.Port,
                GetSecureSocketOption()
            ); 

            if (_smtpEmailSenderConfiguration.UseDefaultCredentials) {
                return;
            }

            client.Authenticate(
                _smtpEmailSenderConfiguration.UserName,
                _smtpEmailSenderConfiguration.Password
            );
        }

        protected override SecureSocketOptions GetSecureSocketOption() {
            return SecureSocketOptions.Auto; 
        }
    }
}