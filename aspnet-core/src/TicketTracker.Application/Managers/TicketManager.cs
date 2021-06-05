using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Localization;
using Abp.Localization.Sources;
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
using TicketTracker.Components.Dto;
using TicketTracker.Projects.Dto;

namespace TicketTracker.Managers {
    public class TicketManager : IDomainService { 
        private readonly ProjectManager projectManager; 
        private readonly IRepository<Ticket> repoTickets;
        private readonly IRepository<Component> repoComponents;
        private readonly IObjectMapper mapper;
        private readonly ILocalizationManager loc;
        private readonly ILocalizationSource l;

        public TicketManager( 
            ProjectManager projectManager, 
            IRepository<Ticket> repoTickets,
            IRepository<Component> repoComponents,
            IObjectMapper mapper,
            ILocalizationManager loc
        ) { 
            this.projectManager = projectManager; 
            this.repoTickets = repoTickets;
            this.repoComponents = repoComponents;
            this.mapper = mapper;
            this.loc = loc;

            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
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
            if (entity.Works != null) {
                for (int i = 0; i < entity.Works.Count; i++) {
                    if(entity.Works[i].ProjectUser != null) {
                        dto.Works[i].User = mapper.Map<SimpleUserDto>(entity.Works[i].ProjectUser.User);
                    }
                }
            }
            var comp = repoComponents.GetAllIncluding(x => x.Project).First(x => x.Id == entity.ComponentId);
            dto.Component = mapper.Map<SimpleComponentDto>(comp);
            dto.Project = mapper.Map<SimpleProjectDto>(comp.Project);
            return dto;
        }
        public List<TicketDto> MapToDto(List<Ticket> entities) {
            List<TicketDto> entityDtos = new List<TicketDto>(); // mapper.Map<List<TicketDto>>(entities); //entities.Select(MapToEntityDto).ToList();

            for (int i = 0; i < entities.Count; i++) {
                entityDtos.Add(MapToDto(entities[i]));
            }
            return entityDtos;
        }
    }
}
