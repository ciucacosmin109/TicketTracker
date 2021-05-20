using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.Managers;
using TicketTracker.ProjectUsers.Dto;

namespace TicketTracker.ProjectUsers {
    [AbpAuthorize]
    public class ProjectUserAppService : IApplicationService {
        private readonly IRepository<ProjectUser> repository;
        private readonly IRepository<Project> repoProjects;
        private readonly IRepository<Ticket> repoTickets;
        private readonly IRepository<Component> repoComponents;
        private readonly IRepository<User, long> repoUsers;
        private readonly IRepository<PRole> repoPRoles;
        private readonly IObjectMapper mapper;
        private readonly IUnitOfWorkManager uowManager;
        private readonly ProjectManager projectManager;
        private readonly IAbpSession session;
        private readonly ILocalizationManager loc;
        private readonly ILocalizationSource l;

        public ProjectUserAppService(
            IRepository<ProjectUser> repository,
            IRepository<Project> repoProjects,
            IRepository<Ticket> repoTickets,
            IRepository<Component> repoComponents,
            IRepository<User, long> repoUsers,
            IRepository<PRole> repoPRoles,
            IObjectMapper mapper,
            IUnitOfWorkManager uowManager,
            ProjectManager projectManager,
            IAbpSession session,
            ILocalizationManager loc
        ) {

            this.repository = repository;
            this.repoProjects = repoProjects;
            this.repoTickets = repoTickets;
            this.repoComponents = repoComponents;
            this.repoUsers = repoUsers;
            this.repoPRoles = repoPRoles;
            this.mapper = mapper;
            this.uowManager = uowManager;
            this.projectManager = projectManager;
            this.session = session;
            this.loc = loc;

            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public GetProjectUsersOutput GetUsersOfProjectAsync(GetProjectUsersInput input) {
            if(input.ProjectId == null && input.TicketId == null) {
                throw new UserFriendlyException(l.GetString("Provide{0}{1}", "ProjectId", "TicketId"));
            }
            if(input.ProjectId == null) {
                int compId = repoTickets.Get(input.TicketId.Value).ComponentId;
                input.ProjectId = repoComponents.Get(compId).ProjectId;
            }

            projectManager.CheckVisibility(session.UserId, input.ProjectId.Value);

            var projectUsers = repository.GetAllIncluding(x => x.User, x => x.Roles).Where(x => x.ProjectId == input.ProjectId);
            var users = projectUsers.Select(x => x.User);

            GetProjectUsersOutput result = new GetProjectUsersOutput();
            result.ProjectId = input.ProjectId.Value;
            result.Users = mapper.Map<List<SimpleUserWithRolesDto>>(users);
            foreach (var usr in result.Users) {
                usr.RoleNames = projectUsers.First(x => x.UserId == usr.Id).Roles.Select(x => x.Name).ToList(); 
            }

            return result;
        }
        public async Task<ProjectUserDto> AddUserToProjectAsync(CreateProjectUserInput input) {
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_Edit);

            try { await repoUsers.GetAsync(input.UserId); }
            catch { throw new EntityNotFoundException(typeof(User), input.UserId); }

            try { await repoProjects.GetAsync(input.ProjectId); }
            catch { throw new EntityNotFoundException(typeof(Project), input.ProjectId); }

            bool exists = (await repository.GetAllListAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId)).Count() > 0;
            if (exists) {
                throw new UserFriendlyException(l.GetString("UserIsAlreadyInProject{0}{1}", input.UserId, input.ProjectId));
            }

            ProjectUser entity = mapper.Map<ProjectUser>(input);
            entity.Roles = await repoPRoles.GetAllListAsync(x => input.RoleNames.Contains(x.Name));
            await repository.InsertAsync(entity);
            await uowManager.Current.SaveChangesAsync();

            return mapper.Map<ProjectUserDto>(entity);
        }
        public async Task RemoveUserFromProject(DeleteProjectUserInput input) {
            if (session.UserId != input.UserId) {
                projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_Edit);
            }
            if (projectManager.IsProjectCreator(input.UserId, input.ProjectId)) {
                throw new UserFriendlyException(l.GetString("CantRemoveTheProjectCreator"));
            }
            await repository.DeleteAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId);
        }

        public RolesOfUserDto GetRolesOfUserOfProject(GetRolesOfUserInput input) {
            projectManager.CheckVisibility(session.UserId, input.ProjectId); 

            var pUsers = repository.GetAllIncluding(x=>x.Roles).Where(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId); 
            if (pUsers.Count() <= 0) {
                throw new UserFriendlyException(l.GetString("UserIsNotInProject{0}{1}", input.UserId, input.ProjectId));
            } 
            ProjectUser pUser = pUsers.First(); 

            var result = mapper.Map<RolesOfUserDto>(pUser);
            result.RoleNames = pUser.Roles.Select(x => x.Name).ToList();
            return result;
        }
        public async Task<RolesOfUserDto> UpdateRolesOfUserOfProject(UpdateRolesOfUserInput input) {
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_Edit);
            if (projectManager.IsProjectCreator(input.UserId, input.ProjectId)) {
                throw new UserFriendlyException(l.GetString("CantChangeRolesOfTheProjectCreator"));
            }

            var pUser = await repository.GetAllIncluding(x => x.Roles).FirstAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId);
            if (pUser == null) {
                throw new UserFriendlyException(l.GetString("UserIsNotInProject{0}{1}", input.UserId, input.ProjectId));
            }

            if(input.RoleNames == null) {
                input.RoleNames = new List<string>();
            }

            // The creator will always have the ProjectManager role
            long? projectCreatorId = (await repoProjects.GetAsync(pUser.ProjectId)).CreatorUserId;
            if(input.UserId == projectCreatorId && !input.RoleNames.Contains(StaticProjectRoleNames.ProjectManager)) {
                input.RoleNames.Add(StaticProjectRoleNames.ProjectManager);
            }

            // Update
            if (input.RoleNames != null)
                pUser.Roles = await repoPRoles.GetAllListAsync(x => input.RoleNames.Contains(x.Name));
            await repository.UpdateAsync(pUser);
            await uowManager.Current.SaveChangesAsync();

            // Return
            var result = mapper.Map<RolesOfUserDto>(pUser);
            result.RoleNames = pUser.Roles.Select(x => x.Name).ToList();
            return result;
        }
    }
}
