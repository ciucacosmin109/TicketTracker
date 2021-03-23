using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Uow;
using Abp.ObjectMapping;
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
using TicketTracker.Works.Dto;

namespace TicketTracker.Works {
    [AbpAuthorize]
    public class WorkAppService : IApplicationService {
        private readonly WorkRepository repoWork;
        private readonly TicketRepository repoTickets;
        private readonly ProjectUserRepository repoPUsers;
        private readonly WorkManager workManager;
        private readonly ProjectManager projectManager;
        private readonly IObjectMapper mapper;
        private readonly IUnitOfWorkManager uowManager;
        private readonly IAbpSession session;

        public WorkAppService(
            WorkRepository repoWork,
            TicketRepository repoTickets,
            ProjectUserRepository repoPUsers,
            WorkManager workManager,
            ProjectManager projectManager,
            IObjectMapper mapper,
            IUnitOfWorkManager uowManager,
            IAbpSession session
        ) {
            this.repoWork = repoWork;
            this.repoTickets = repoTickets;
            this.repoPUsers = repoPUsers;
            this.workManager = workManager;
            this.projectManager = projectManager;
            this.mapper = mapper;
            this.uowManager = uowManager;
            this.session = session;
        }

        public async Task<WorkDto> GetAsync(Entity<int> input) {
            var entity = await repoWork.GetIncludingInfoAsync(input.Id);
            var dto = mapper.Map<WorkDto>(entity);
            workManager.PopulateWorkDtoWithUser(dto, entity.ProjectUserId);
            return dto;
        }
        public async Task<WorkDto> CreateAsync(CreateWorkInput input) {
            ProjectUser pUser;
            try { pUser = await repoPUsers.GetAsync(input.ProjectUserId); }
            catch { throw new UserFriendlyException("There is no project user with id=" + input.ProjectUserId.ToString()); }

            if (session.UserId != pUser.UserId)
                projectManager.CheckProjectPermission(session.UserId, pUser.ProjectId, StaticProjectPermissionNames.Ticket_AssignWork);
            else
                projectManager.CheckProjectPermission(session.UserId, pUser.ProjectId, StaticProjectPermissionNames.Ticket_SelfAssignWork);

            try { await repoTickets.GetAsync(input.TicketId); }
            catch { throw new UserFriendlyException("There is no ticket with id=" + input.TicketId.ToString()); }

            bool exists = (await repoWork.GetAllListAsync(x => x.ProjectUserId == input.ProjectUserId && x.TicketId == input.TicketId)).Count() > 0;
            if (exists) {
                throw new UserFriendlyException("The project user with with id=" + input.ProjectUserId.ToString() + " is already working at the ticket");
            }

            Work entity = mapper.Map<Work>(input);
            await repoWork.InsertAndGetIdAsync(entity);
            await uowManager.Current.SaveChangesAsync();

            var dto = mapper.Map<WorkDto>(entity);
            return dto;
        }
        public async Task<WorkDto> UpdateAsync(UpdateWorkInput input) { 
            ProjectUser pUser;
            try {
                int pUserId = (await repoWork.GetAsync(input.Id)).ProjectUserId;
                pUser = await repoPUsers.GetAsync(pUserId); 
            } catch { throw new UserFriendlyException("There is work item with id=" + input.Id.ToString()); }

            if (session.UserId != pUser.UserId)
                projectManager.CheckProjectPermission(session.UserId, pUser.ProjectId, StaticProjectPermissionNames.Ticket_AssignWork);

            var entity = mapper.Map<Work>(input);
            await repoWork.UpdateAsync(entity);

            return mapper.Map<WorkDto>(entity);
        }
        public async Task DeleteAsync(Entity<int> input) {
            bool isCreator = (await repoWork.GetAsync(input.Id)).CreatorUserId == session.UserId;
            if (!isCreator) {
                workManager.CheckWorkPermission(session.UserId, input.Id, StaticProjectPermissionNames.Ticket_AssignWork);
            }
            await repoWork.DeleteAsync(input.Id);
        }
    }
}
