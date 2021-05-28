using Abp.BackgroundJobs; 
using Abp.Dependency; 
using Abp.Domain.Uow; 
using Abp.Net.Mail;  
using TicketTracker.BackgroundJobs.Data;

namespace TicketTracker.BackgroundJobs {
    public class SendEmailJob : BackgroundJob<SendEmailArgs>, ITransientDependency { 
        private readonly IEmailSender _emailSender; 

        public SendEmailJob( 
            IEmailSender emailSender 
        ) { 
            _emailSender = emailSender; 
        }

        [UnitOfWork]
        public override void Execute(SendEmailArgs args) { 
            _emailSender.Send(
                to: args.To,
                subject: args.Subject,
                body: args.Body,
                isBodyHtml: true
            );
        }
    }
}
