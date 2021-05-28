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
        private readonly WorkRepository repoWorks;
        private readonly IRepository<ProjectUser> repoPUsers;
        private readonly IRepository<Component> repoComponents;
        private readonly IAbpSession session;
        private readonly ProjectManager projectManager;
        private readonly TicketManager ticketManager;
        private readonly WorkManager workManager;
        private readonly EmailManager emailManager;

        public TicketAppService(
            TicketRepository repoTickets,
            WorkRepository repoWorks,
            IRepository<ProjectUser> repoPUsers,
            IRepository<Component> repoComponents,
            IAbpSession session,
            ProjectManager projectManager,
            TicketManager ticketManager,
            WorkManager workManager,
            EmailManager emailManager
        ) : base(repoTickets) {
            this.repoTickets = repoTickets;
            this.repoWorks = repoWorks;
            this.repoPUsers = repoPUsers;
            this.repoComponents = repoComponents;
            this.session = session;
            this.projectManager = projectManager;
            this.ticketManager = ticketManager;
            this.workManager = workManager;
            this.emailManager = emailManager;
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
            if(input.ComponentId != null) {
                int projectId = (await repoComponents.GetAsync(input.ComponentId.Value)).ProjectId;
                projectManager.CheckVisibility(session.UserId, projectId);
            }else if(input.ProjectId != null) {
                projectManager.CheckVisibility(session.UserId, input.ProjectId.Value);
            } else if(input.AssignedUserId == null){
                throw new UserFriendlyException(L("Provide{0}{1}{3}", "ComponentId", "ProjectId", "UserId"));
            }
            
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
            if (input.ComponentId != null) {
                return res.Where(x => x.ComponentId == input.ComponentId);

            } else if (input.ProjectId != null) {
                List<int> components = repoComponents
                    .GetAll()
                    .Where(x => x.ProjectId == input.ProjectId)
                    .Select(x => x.Id)
                    .ToList();
                return res.Where(x => components.Contains(x.ComponentId));

            } else if (input.AssignedUserId != null) {
                List<int?> tickets = repoPUsers
                    .GetAllIncluding(x => x.Works)
                    .Where(x => x.UserId == input.AssignedUserId)
                    .SelectMany(x => x.Works)
                    .Where(x => x.IsWorking)
                    .Select(x => x.TicketId)
                    .ToList(); 
                return res.Where(x => tickets.Contains(x.Id));

            } else return res;
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
            Ticket oldT = await Repository.GetAsync(input.Id);
            string oldTitle = oldT.Title;
            long? creatorId = oldT.CreatorUserId;
            if (session.UserId != creatorId)
                ticketManager.CheckTicketPermission(session.UserId, input.Id, StaticProjectPermissionNames.Component_ManageTickets);

            await base.UpdateAsync(input);
            await CurrentUnitOfWork.SaveChangesAsync();

            Ticket newT = await repoTickets.GetIncludingInfoAsync(input.Id);
            emailManager.SendTicketUpdate(oldTitle, newT);
            
            return ticketManager.MapToDto(newT);
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId)
                ticketManager.CheckTicketPermission(session.UserId, input.Id, StaticProjectPermissionNames.Component_ManageTickets);

            await base.DeleteAsync(input);
        }
    }
}
