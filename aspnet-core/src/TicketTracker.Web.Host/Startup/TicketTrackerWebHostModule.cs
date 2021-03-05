using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using TicketTracker.Configuration;
using Microsoft.AspNetCore.Mvc.Filters;
using Abp.MailKit;
using TicketTracker.Web.Host.Custom;
using Abp.Dependency;
using MailKit.Security;
using Abp.Configuration.Startup;
using Abp.AspNetCore;

namespace TicketTracker.Web.Host.Startup
{
    [DependsOn(
        typeof(TicketTrackerWebCoreModule),
        typeof(AbpMailKitModule) 
    )] 
    public class TicketTrackerWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public TicketTrackerWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize() {
            // Replace IMailKitSmtpBuilder :D 
            //Configuration.ReplaceService<IMailKitSmtpBuilder, CustomMailKitSmtpBuilder>(DependencyLifeStyle.Singleton);
        }
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(TicketTrackerWebHostModule).GetAssembly());
            
            // Mail settings
            Configuration.Modules.AbpMailKit().SecureSocketOption = SecureSocketOptions.Auto;
        }
    }
}
