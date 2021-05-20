using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Managers;
using TicketTracker.Tickets.Dto;

namespace TicketTracker.Tickets {
    [AbpAuthorize]
    public class TicketAppService : AsyncCrudAppService<Ticket, TicketDto, int, GetAllTicketsInput, CreateTicketInput, UpdateTicketInput> {
        private readonly TicketRepository repoTickets;
        private readonly IRepository<Component> repoComponents;
        private readonly IAbpSession session;
        private readonly ProjectManager projectManager;
        private readonly TicketManager ticketManager;
        private readonly WorkManager workManager;

        public TicketAppService(
            TicketRepository repoTickets,
            IRepository<Component> repoComponents,
            IAbpSession session,
            ProjectManager projectManager,
            TicketManager ticketManager,
            WorkManager workManager) 
            : base(repoTickets) {
            this.repoTickets = repoTickets;
            this.repoComponents = repoComponents;
            this.session = session;
            this.projectManager = projectManager;
            this.ticketManager = ticketManager;
            this.workManager = workManager;

            LocalizationSourceName = TicketTrackerConsts.LocalizationSourceName;
        }


        public override async Task<TicketDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await repoTickets.GetIncludingInfoAsync(input.Id);
            ticketManager.CheckVisibility(session.UserId, input.Id);
             
            return ticketManager.MapToDto(entity);
        }

        public override async Task<PagedResultDto<TicketDto>> GetAllAsync(GetAllTicketsInput input) {
            CheckGetAllPermission(); 
            int projectId = (await repoComponents.GetAsync(input.ComponentId)).ProjectId;
            projectManager.CheckVisibility(session.UserId, projectId);
             
            var query = CreateFilteredQuery(input); 
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            var entities = await AsyncQueryableExecuter.ToListAsync(query); 
            return new PagedResultDto<TicketDto>(
                totalCount,
                ticketManager.MapToDto(entities)
            );
        }
        protected override IQueryable<Ticket> CreateFilteredQuery(GetAllTicketsInput input) {
            var res = repoTickets.GetAllIncludingInfo();
            return res.Where(x => x.ComponentId == input.ComponentId);
        }
         
        public override async Task<TicketDto> CreateAsync(CreateTicketInput input) {
            CheckCreatePermission();
            int projectId = (await repoComponents.GetAsync(input.ComponentId)).ProjectId;
            projectManager.CheckProjectPermission(session.UserId, projectId, StaticProjectPermissionNames.Component_AddTickets); 

            var entity = MapToEntity(input);

            int id = await Repository.InsertAndGetIdAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
              
            return ticketManager.MapToDto(await repoTickets.GetIncludingBasicInfoAsync(id));
        }

        public override async Task<TicketDto> UpdateAsync(UpdateTicketInput input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId)
                ticketManager.CheckTicketPermission(session.UserId, input.Id, StaticProjectPermissionNames.Component_ManageTickets);

            await base.UpdateAsync(input);
            await CurrentUnitOfWork.SaveChangesAsync();
            
            return ticketManager.MapToDto(await repoTickets.GetIncludingInfoAsync(input.Id));
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId)
                ticketManager.CheckTicketPermission(session.UserId, input.Id, StaticProjectPermissionNames.Component_ManageTickets);

            await base.DeleteAsync(input);
        }
    }
}
