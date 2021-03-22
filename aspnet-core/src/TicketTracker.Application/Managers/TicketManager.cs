using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;

namespace TicketTracker.Managers {
    public class TicketManager : IDomainService { 
        private readonly ProjectManager projectManager;
        private readonly IRepository<Ticket> repoTickets;
        private readonly IRepository<Component> repoComponents;

        public TicketManager( 
            ProjectManager projectManager,
            IRepository<Ticket> repoTickets,
            IRepository<Component> repoComponents
        ) { 
            this.projectManager = projectManager;
            this.repoTickets = repoTickets;
            this.repoComponents = repoComponents;
        }

        public void CheckViewTicketPermission(long? userId, int ticketId) {
            CheckTicketPermission(userId, ticketId, null);
        }
        public void CheckTicketPermission(long? userId, int ticketId, string permissionName = null) {
            int componentId = repoTickets.Get(ticketId).ComponentId;
            int projectId = repoComponents.Get(componentId).ProjectId;

            projectManager.CheckProjectPermission(userId, projectId, permissionName);
        }

    }
}
