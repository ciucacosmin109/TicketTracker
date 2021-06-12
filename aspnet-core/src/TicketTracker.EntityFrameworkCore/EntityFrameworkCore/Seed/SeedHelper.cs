using System;
using System.Transactions;
using Microsoft.EntityFrameworkCore;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.Uow;
using Abp.MultiTenancy;
using TicketTracker.EntityFrameworkCore.Seed.Host;
using TicketTracker.EntityFrameworkCore.Seed.Tenants;
using TicketTracker.EntityFrameworkCore.Seed.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using TicketTracker.Configuration;
using Microsoft.Extensions.Hosting;

namespace TicketTracker.EntityFrameworkCore.Seed
{
    public static class SeedHelper
    {
        public static void SeedHostDb(IIocResolver iocResolver) // used at startup
        {
            WithDbContext<TicketTrackerDbContext>(iocResolver, SeedHostDb);
        }

        public static void SeedHostDb(TicketTrackerDbContext context, IConfiguration config = null) // used by the migrator + at startup
        {
            context.SuppressAutoSetTenantId = true;

            // Host seed
            new InitialHostDbBuilder(context).Create();
            if(config != null) {
                new DefaultSettingsCreator(context, config).Create(); // will not be called by the migrator
            }

            // Default tenant seed (in host database).
            new DefaultTenantBuilder(context).Create();
            new TenantRoleAndUserBuilder(context, 1).Create();

            // Initial data
            new InitialDataBuilder(context, 1).Create(); 
        }

        private static void WithDbContext<TDbContext>(IIocResolver iocResolver, Action<TDbContext, IConfiguration> contextAction)
            where TDbContext : DbContext 
        {
            using (var uowManager = iocResolver.ResolveAsDisposable<IUnitOfWorkManager>())
            using (var env = iocResolver.ResolveAsDisposable<IWebHostEnvironment>()) 
            {
                using (var uow = uowManager.Object.Begin(TransactionScopeOption.Suppress))
                {
                    var context = uowManager.Object.Current.GetDbContext<TDbContext>(MultiTenancySides.Host);

                    contextAction(
                        context,
                        AppConfigurations.Get(env.Object.ContentRootPath, env.Object.EnvironmentName, env.Object.IsDevelopment())
                    );

                    uow.Complete();
                }
            }
        }
    }
}
