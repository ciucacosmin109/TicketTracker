using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using TicketTracker.EntityFrameworkCore;
using TicketTracker.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace TicketTracker.Web.Tests
{
    [DependsOn(
        typeof(TicketTrackerWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class TicketTrackerWebTestModule : AbpModule
    {
        public TicketTrackerWebTestModule(TicketTrackerEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(TicketTrackerWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(TicketTrackerWebMvcModule).Assembly);
        }
    }
}