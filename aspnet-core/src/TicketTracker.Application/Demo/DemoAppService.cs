using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.EntityFrameworkCore;
using Abp.Runtime.Session;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Activities.Dto;
using TicketTracker.Authorization;
using TicketTracker.Entities;
using TicketTracker.EntityFrameworkCore;
using TicketTracker.EntityFrameworkCore.Seed.Demo;

namespace TicketTracker.Demo {
    [AbpAuthorize(PermissionNames.Pages_AdminTools)]
    public class DemoAppService : ApplicationService {
        private readonly IAbpSession session;
        private readonly IDbContextProvider<TicketTrackerDbContext> dbContextProvider;

        public DemoAppService(
            IAbpSession session,
            IDbContextProvider<TicketTrackerDbContext> dbContextProvider
        ) {
            this.session = session;
            this.dbContextProvider = dbContextProvider;
        }

        public void InitDemoDatabaseAsync() {
            var demoBuilder = new DemoDataBuilder(dbContextProvider.GetDbContext(), session.TenantId != null ? session.TenantId.Value : 1);
            demoBuilder.Create();
        }
        public void ClearDatabaseAsync() {
            var demoBuilder = new DemoDataBuilder(dbContextProvider.GetDbContext(), session.TenantId != null ? session.TenantId.Value : 1);
            demoBuilder.ClearDatabase();
        }

    }
}
