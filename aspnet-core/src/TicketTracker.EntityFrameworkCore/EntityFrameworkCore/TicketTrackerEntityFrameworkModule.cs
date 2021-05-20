using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using System.Transactions;
using TicketTracker.Configuration;
using TicketTracker.EntityFrameworkCore.Seed;
using TicketTracker.Web;

namespace TicketTracker.EntityFrameworkCore
{
    [DependsOn(
        typeof(TicketTrackerCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class TicketTrackerEntityFrameworkModule : AbpModule
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }

        public override void PreInitialize(){
            var config = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());
            var type = config.GetSection("DatabaseConfig").GetSection("Type").Value;
            if (type == "ORACLE") {
                Configuration.UnitOfWork.IsolationLevel = IsolationLevel.ReadCommitted;
            }

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
