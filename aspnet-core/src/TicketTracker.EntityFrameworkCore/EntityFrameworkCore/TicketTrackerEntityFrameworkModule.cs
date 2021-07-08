using Abp.EntityFrameworkCore.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using System.Transactions; 
using TicketTracker.EntityFrameworkCore.Seed;
using Microsoft.Extensions.Hosting;
using TicketTracker.Configuration;

namespace TicketTracker.EntityFrameworkCore
{
    [DependsOn(
        typeof(TicketTrackerCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class TicketTrackerEntityFrameworkModule : AbpModule {  

        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; } 
        public bool SkipDbSeed { get; set; }

        public override void PreInitialize(){
            // Oracle database
            //Configuration.UnitOfWork.IsolationLevel = IsolationLevel.ReadCommitted;

            if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext<TicketTrackerDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        TicketTrackerDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        TicketTrackerDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(TicketTrackerEntityFrameworkModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb(IocManager);
            }
        }
    }
}
