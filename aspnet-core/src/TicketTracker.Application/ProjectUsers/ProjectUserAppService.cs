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
using TicketTracker.EntityFrameworkCore.Repositories;

using Abp.Linq.Extensions;
using System.Linq.Dynamic.Core;
using Abp.Extensions;

namespace TicketTracker.ProjectUsers {
    [AbpAuthorize]
    public class ProjectUserAppService : IApplicationService {
        private readonly ProjectUserRepository repository;
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
            ProjectUserRepository repository,
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

        private void AddPermissions(ProjectUserDto pud, ProjectUser pu) {
            if(pud == null || pu == null) {
                return;
            }

            foreach (var role in pud.Roles) {
                var permissions = pu.Roles.SelectMany(x => x.Permissions);
                if(permissions != null) {
                    role.PermissionNames = permissions.Select(x => x.Name).ToList();
                }
            }
        }
        
        public async Task<ProjectUserDto> GetAsync(GetProjectUserInput input) {
            projectManager.CheckVisibility(session.UserId, input.ProjectId);
            ProjectUser entity = await repository.GetAllIncludingUserAndRoles()
                .Where(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId)
                .FirstOrDefaultAsync();
            /*if(entity == null) {
                throw new UserFriendlyException(l.GetString("UserIsNotInProject{0}{1}", input.UserId, input.ProjectId));
            }*/
            
            var result = mapper.Map<ProjectUserDto>(entity);
            AddPermissions(result, entity); 
            return result;
        }
        public async Task<PagedResultDto<ProjectUserDto>> GetAllAsync(GetAllProjectUsersInput input) {
            if (input.ProjectId == null && input.TicketId == null) {
                throw new UserFriendlyException(l.GetString("Provide{0}{1}", "ProjectId", "TicketId"));
            }
            if (input.ProjectId == null) {
                int compId = (await repoTickets.GetAsync(input.TicketId.Value)).ComponentId;
                input.ProjectId = (await repoComponents.GetAsync(compId)).ProjectId;
            }
             
            projectManager.CheckVisibility(session.UserId, input.ProjectId.Value);

            var query = repository
                .GetAllIncludingUserAndRoles() 
                .Where(x => x.ProjectId == input.ProjectId); 
            int totalCount = query.Count();
            query = query.PageBy(input); 

            List<ProjectUserDto> result = new List<ProjectUserDto>(); 
            foreach (var entity in query) {
                var dto = mapper.Map<ProjectUserDto>(entity);
                AddPermissions(dto, entity);
                result.Add(dto);
            }

            return new PagedResultDto<ProjectUserDto> {
                Items = result,
                TotalCount = totalCount
            };
        }
        
        public async Task<ProjectUserDto> CreateAsync(CreateProjectUserInput input) {
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
             
            entity = await repository.GetAllIncludingUserAndRoles()
                .Where(x => x.Id == entity.Id)
                .FirstOrDefaultAsync();
            var result = mapper.Map<ProjectUserDto>(entity);
            AddPermissions(result, entity);
            return result;
        }
        public async Task<ProjectUserDto> UpdateAsync(UpdateProjectUserInput input) {
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_Edit);

            var pUser = await repository
                .GetAllIncludingUserAndRoles()
                .FirstAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId);
            if (pUser == null) {
                throw new UserFriendlyException(l.GetString("UserIsNotInProject{0}{1}", input.UserId, input.ProjectId));
            }
            if (input.RoleNames == null) {
                input.RoleNames = new List<string>();
            }

            // Only the project creator can add roles to itself
            long? projectCreatorId = (await repoProjects.GetAsync(pUser.ProjectId)).CreatorUserId;
            if (projectManager.IsProjectCreator(input.UserId, input.ProjectId) && session.UserId != input.UserId) {
                throw new UserFriendlyException(l.GetString("CantChangeRolesOfTheProjectCreator"));
            }
            
            // The creator will always have the ProjectManager role
            if (input.UserId == projectCreatorId && !input.RoleNames.Contains(StaticProjectRoleNames.ProjectManager)) {
                input.RoleNames.Add(StaticProjectRoleNames.ProjectManager);
            }

            // Update
            pUser.Roles = await repoPRoles.GetAllListAsync(x => input.RoleNames.Contains(x.Name));
            await repository.UpdateAsync(pUser);
            await uowManager.Current.SaveChangesAsync();

            // Return
            var result = mapper.Map<ProjectUserDto>(pUser);
            AddPermissions(result, pUser);
            return result;
        }
        
        public async Task DeleteAsync(DeleteProjectUserInput input) {
            if (session.UserId != input.UserId) {
                projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_Edit);
            }
            if (projectManager.IsProjectCreator(input.UserId, input.ProjectId)) {
                throw new UserFriendlyException(l.GetString("CantRemoveTheProjectCreator"));
            }
            await repository.DeleteAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId);
        }
         
    }
}
