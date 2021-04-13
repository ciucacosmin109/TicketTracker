using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.ObjectMapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Tickets.Dto;
using TicketTracker.Users.Dto;

namespace TicketTracker.Managers {
    public class TicketManager : IDomainService { 
        private readonly ProjectManager projectManager;
        private readonly WorkManager workManager;
        private readonly IRepository<Ticket> repoTickets;
        private readonly IRepository<Component> repoComponents;
        private readonly IObjectMapper mapper;

        public TicketManager( 
            ProjectManager projectManager,
            WorkManager workManager,
            IRepository<Ticket> repoTickets,
            IRepository<Component> repoComponents,
            IObjectMapper mapper
        ) { 
            this.projectManager = projectManager;
            this.workManager = workManager;
            this.repoTickets = repoTickets;
            this.repoComponents = repoComponents;
            this.mapper = mapper;
        }

        public void CheckVisibility(long? userId, int ticketId) {
            CheckTicketPermission(userId, ticketId, null);
        }
        public void CheckTicketPermission(long? userId, int ticketId, string permissionName = null) {
            int componentId = repoTickets.Get(ticketId).ComponentId;
            int projectId = repoComponents.Get(componentId).ProjectId;

            projectManager.CheckProjectPermission(userId, projectId, permissionName);
        }

        public TicketDto MapToDto(Ticket entity) {
            TicketDto dto = mapper.Map<TicketDto>(entity);
            if (entity.Work != null) {
                workManager.PopulateWorkDtoWithUser(dto.Work, entity.Work.ProjectUser.User);
            }
            return dto;
        }
        public List<TicketDto> MapToDto(List<Ticket> entities) {
            List<TicketDto> entityDtos = mapper.Map<List<TicketDto>>(entities); //entities.Select(MapToEntityDto).ToList();

            for (int i = 0; i < entityDtos.Count; i++) {
                if (entities[i].Work != null) {
                    workManager.PopulateWorkDtoWithUser(entityDtos[i].Work, entities[i].Work.ProjectUser.User);
                }
            }
            return entityDtos;
        }
    }
}
