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
using TicketTracker.Projects.Dto;
using TicketTracker.Projects.Dto.RoleDto;

namespace TicketTracker.Projects {

    [AbpAuthorize]
    public class ProjectAppService : AsyncCrudAppService<Project, ProjectDto, int, GetAllProjectsInput, CreateProjectInput, UpdateProjectInput> {
        private readonly ProjectRepository repoProjects;
        private readonly ProjectUserRepository repoPUsers;
        private readonly IRepository<PRole> repoPRoles;
        private readonly ProjectManager projectManager;
        private readonly IAbpSession session;

        public ProjectAppService(
            IRepository<Project> repository,
            ProjectRepository repoProjects,
            ProjectUserRepository repoPUsers,
            IRepository<PRole> repoPRoles,
            ProjectManager projectManager,
            IAbpSession session) : base(repository) {
            this.repoProjects = repoProjects;
            this.repoPUsers = repoPUsers;
            this.repoPRoles = repoPRoles;
            this.projectManager = projectManager;
            this.session = session;
        }

        public override async Task<ProjectDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            projectManager.CheckViewProjectPermission(session.UserId, input.Id, entity.IsPublic);

            return MapToEntityDto(entity);
        }
         
        public override async Task<PagedResultDto<ProjectDto>> GetAllAsync(GetAllProjectsInput input) {
            return await base.GetAllAsync(input);
        }
        protected override IQueryable<Project> CreateFilteredQuery(GetAllProjectsInput input) {
            var res = base.CreateFilteredQuery(input); 
            return projectManager.FilterQueryByPermission(res, session.UserId, input.IsPublic);
        }

        public async Task<PagedResultDto<ProjectWithRolesDto>> GetAllIncludingRolesAsync(GetAllProjectsInput input) {
            CheckGetAllPermission();

            var query = repoProjects.GetAllIncludingRoles();
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            query = projectManager.FilterQueryByPermission(query, session.UserId, input.IsPublic);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            List<ProjectWithRolesDto> result = new List<ProjectWithRolesDto>();
            foreach (Project proj in query) {
                List<PRole> roles = proj.ProjectUsers
                    .Where(x => x.UserId == session.UserId)
                    .SelectMany(x => x.Roles)
                    .ToList();

                ProjectWithRolesDto p = ObjectMapper.Map<ProjectWithRolesDto>(proj);
                p.Roles = ObjectMapper.Map<List<PRoleDto>>(roles); 

                result.Add(p);
            }

            //var entities = await AsyncQueryableExecuter.ToListAsync(query); 
            return new PagedResultDto<ProjectWithRolesDto>(
                totalCount, result
            );
        }
        public async Task<PagedResultDto<ProjectWithRolesAndPermissionsDto>> GetAllIncludingRolesAndPermissionsAsync(GetAllProjectsInput input) {
            CheckGetAllPermission();

            var query = repoProjects.GetAllIncludingRoles();
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            query = projectManager.FilterQueryByPermission(query, session.UserId, input.IsPublic);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            var result = new List<ProjectWithRolesAndPermissionsDto>();
            foreach (Project proj in query) { 
                List<PRole> roles = proj.ProjectUsers
                    .Where(x => x.UserId == session.UserId)
                    .SelectMany(x => x.Roles)
                    .ToList();

                ProjectWithRolesAndPermissionsDto p = ObjectMapper.Map<ProjectWithRolesAndPermissionsDto>(proj);
                p.Roles = new List<PRoleWithPermissionsDto>();
                foreach (PRole role in roles) {
                    p.Roles.Add(ObjectMapper.Map<PRoleWithPermissionsDto>(role));
                    p.Roles.Last().PermissionNames = role.Permissions.Select(x => x.Name).ToList();
                } 

                result.Add(p);
            }

            //var entities = await AsyncQueryableExecuter.ToListAsync(query); 
            return new PagedResultDto<ProjectWithRolesAndPermissionsDto>(
                totalCount, result
            );
        }

        public override async Task<ProjectDto> CreateAsync(CreateProjectInput input) {
            CheckCreatePermission(); 
            var entity = MapToEntity(input);

            int projectId = await Repository.InsertAndGetIdAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();

            await repoPUsers.InsertAsync(new ProjectUser {
                ProjectId = projectId,
                UserId = session.UserId.Value,
                Roles = new List<PRole> { repoPRoles.FirstOrDefault(x => x.Name == StaticProjectRoleNames.ProjectManager) } 
            });
            await CurrentUnitOfWork.SaveChangesAsync();
            
            return MapToEntityDto(entity);
        }
         
        public override async Task<ProjectDto> UpdateAsync(UpdateProjectInput input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId)
                throw new UserFriendlyException("You are not the creator of this project");

            return await base.UpdateAsync(input);
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId)
                throw new UserFriendlyException("You are not the creator of this project");

            await base.DeleteAsync(input);
        }


    }
}
