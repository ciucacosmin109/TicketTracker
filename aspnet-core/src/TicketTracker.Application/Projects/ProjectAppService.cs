using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.Projects.Dto;

namespace TicketTracker.Projects {

    [AbpAuthorize]
    public class ProjectAppService : AsyncCrudAppService<Project, ProjectDto, int, GetAllProjectsInput, CreateProjectInput, UpdateProjectInput> {
        private readonly IRepository<ProjectUser> repoPUsers;
        private readonly IRepository<PRole> repoPRole;
        private readonly IAbpSession session;

        public ProjectAppService(
            IRepository<Project> repository,
            IRepository<ProjectUser> repoPUsers,
            IRepository<PRole> repoPRole,
            IAbpSession session) : base(repository) {
            
            this.repoPUsers = repoPUsers;
            this.repoPRole = repoPRole;
            this.session = session;
        }
        protected void CheckViewProjectPermission(long? userId, int projectId, bool isProjectPublic) {
            if (isProjectPublic) {
                return;
            }

            var hasPermission = repoPUsers.GetAll().Where(x => x.ProjectId == projectId && x.UserId == userId).Count() > 0;
            if (!hasPermission) {
                throw new AbpAuthorizationException("You are not assigned to this project");
            }
        }
        protected void CheckProjectPermission(long? userId, int projectId, string permissionName) { 
            var hasPermission = repoPUsers.GetAll().Where(x => x.ProjectId == projectId && x.UserId == userId).Count() > 0;
            if (!hasPermission) {
                throw new AbpAuthorizationException("You are not assigned to this project");
            }
        }

        public override async Task<ProjectDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            CheckViewProjectPermission(session.UserId, input.Id, entity.IsPublic);

            return MapToEntityDto(entity);
        }
         
        public override async Task<PagedResultDto<ProjectDto>> GetAllAsync(GetAllProjectsInput input) {
            return await base.GetAllAsync(input);
        }
        protected override IQueryable<Project> CreateFilteredQuery(GetAllProjectsInput input) {
            var res = base.CreateFilteredQuery(input).Where(x => x.IsPublic == input.IsPublic);

            if (!input.IsPublic) { 
                var projectIds = repoPUsers.GetAll().Where(x => x.UserId == session.UserId).Select(x => x.Id);
                res.Where(x => projectIds.Contains(x.Id));
            }
            return res;
        }
         
        public override async Task<ProjectDto> CreateAsync(CreateProjectInput input) {
            CheckCreatePermission(); 
            var entity = MapToEntity(input);

            int projectId = await Repository.InsertAndGetIdAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();

            await repoPUsers.InsertAsync(new ProjectUser {
                ProjectId = projectId,
                UserId = session.UserId.Value,
                Roles = new List<PRole> { repoPRole.FirstOrDefault(x => x.Name == StaticProjectRoleNames.ProjectManager) } 
            });
            await CurrentUnitOfWork.SaveChangesAsync();
            
            return MapToEntityDto(entity);
        }
         
        public override async Task<ProjectDto> UpdateAsync(UpdateProjectInput input) {
            return await base.UpdateAsync(input);
        }
    }
}
