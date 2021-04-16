using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Abp.UI;
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
        private readonly IRepository<User, long> repoUsers;
        private readonly IRepository<PRole> repoPRoles;
        private readonly IObjectMapper mapper;
        private readonly IUnitOfWorkManager uowManager;
        private readonly ProjectManager projectManager;
        private readonly IAbpSession session;

        public ProjectUserAppService(
            IRepository<ProjectUser> repository,
            IRepository<Project> repoProjects,
            IRepository<User, long> repoUsers,
            IRepository<PRole> repoPRoles,
            IObjectMapper mapper,
            IUnitOfWorkManager uowManager,
            ProjectManager projectManager,
            IAbpSession session
        ) {

            this.repository = repository;
            this.repoProjects = repoProjects;
            this.repoUsers = repoUsers;
            this.repoPRoles = repoPRoles;
            this.mapper = mapper;
            this.uowManager = uowManager;
            this.projectManager = projectManager;
            this.session = session;
        }

        public GetProjectUsersOutput GetUsersOfProjectAsync(GetProjectUsersInput input) {
            projectManager.CheckVisibility(session.UserId, input.ProjectId);

            var projectUsers = repository.GetAllIncluding(x => x.User, x => x.Roles).Where(x => x.ProjectId == input.ProjectId);
            var users = projectUsers.Select(x => x.User);

            GetProjectUsersOutput result = new GetProjectUsersOutput();
            result.ProjectId = input.ProjectId;
            result.Users = mapper.Map<List<SimpleUserWithRolesDto>>(users);
            foreach (var usr in result.Users) {
                usr.RoleNames = projectUsers.First(x => x.UserId == usr.Id).Roles.Select(x => x.Name).ToList(); 
            }

            return result;
        }
        public async Task<ProjectUserDto> AddUserToProjectAsync(CreateProjectUserInput input) {
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_ManageUsers);

            try { await repoUsers.GetAsync(input.UserId); }
            catch { throw new UserFriendlyException("There is no user with id=" + input.UserId.ToString()); }

            try { await repoProjects.GetAsync(input.ProjectId); }
            catch { throw new UserFriendlyException("There is no project with id=" + input.ProjectId.ToString()); }

            bool exists = (await repository.GetAllListAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId)).Count() > 0;
            if (exists) {
                throw new UserFriendlyException("The user with with id=" + input.UserId.ToString() + " is already added the project");
            }

            ProjectUser entity = mapper.Map<ProjectUser>(input);
            entity.Roles = await repoPRoles.GetAllListAsync(x => input.RoleNames.Contains(x.Name));
            await repository.InsertAsync(entity);
            await uowManager.Current.SaveChangesAsync();

            return mapper.Map<ProjectUserDto>(entity);
        }
        public async Task RemoveUserFromProject(DeleteProjectUserInput input) {
            if (session.UserId != input.UserId) {
                projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_ManageUsers);
            }
            if (projectManager.IsProjectCreator(input.UserId, input.ProjectId)) {
                throw new UserFriendlyException("Can't remove the project creator");
            }
            await repository.DeleteAsync(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId);
        }

        public RolesOfUserDto GetRolesOfUserOfProject(GetRolesOfUserInput input) {
            projectManager.CheckVisibility(session.UserId, input.ProjectId); 

            var pUsers = repository.GetAllIncluding(x=>x.Roles).Where(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId); 
            if (pUsers.Count() <= 0) {
                throw new UserFriendlyException("The user with with id=" + input.UserId.ToString() + " is not added to the project with id=" + input.ProjectId.ToString());
            } 
            ProjectUser pUser = pUsers.First(); 

            var result = mapper.Map<RolesOfUserDto>(pUser);
            result.RoleNames = pUser.Roles.Select(x => x.Name).ToList();
            return result;
        }
        public async Task<RolesOfUserDto> UpdateRolesOfUserOfProject(UpdateRolesOfUserInput input) {
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_ManageRoles);
            if (projectManager.IsProjectCreator(input.UserId, input.ProjectId)) {
                throw new UserFriendlyException("Can't change the roles of the project creator");
            }

            var pUsers = repository.GetAllIncluding(x => x.Roles).Where(x => x.UserId == input.UserId && x.ProjectId == input.ProjectId);
            bool exists = pUsers.Count() > 0;
            if (!exists) {
                throw new UserFriendlyException("The user with with id=" + input.UserId.ToString() + " is not added to the project with id=" + input.ProjectId.ToString());
            }

            ProjectUser pUser = pUsers.First();
            pUser.Roles = await repoPRoles.GetAllListAsync(x => input.RoleNames.Contains(x.Name));
            await repository.UpdateAsync(pUser);
            await uowManager.Current.SaveChangesAsync();

            var result = mapper.Map<RolesOfUserDto>(pUser);
            result.RoleNames = pUser.Roles.Select(x => x.Name).ToList();
            return result;
        }
    }
}
