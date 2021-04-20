﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization; 
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Managers;
using TicketTracker.ProjectRoles.Dto;
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
            if (!entity.IsPublic)
                projectManager.CheckVisibility(session.UserId, input.Id);

            return MapToEntityDto(entity);
        }
        private async Task<ProjectWithRolesDto> GetIncludingRolesAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await repoProjects.GetAllIncludingRoles().FirstOrDefaultAsync(x => x.Id == input.Id);
            if (entity == null)
                throw new UserFriendlyException("There is no Project with Id=" + input.Id);

            if (!entity.IsPublic)
                projectManager.CheckVisibility(session.UserId, input.Id);

            List<PRole> roles = entity.ProjectUsers
                .Where(x => x.UserId == session.UserId)
                .SelectMany(x => x.Roles)
                .ToList();

            ProjectWithRolesDto p = ObjectMapper.Map<ProjectWithRolesDto>(entity);
            p.Roles = ObjectMapper.Map<List<PRoleDto>>(roles);

            return p;
        }

        public override async Task<PagedResultDto<ProjectDto>> GetAllAsync(GetAllProjectsInput input) {
            return await base.GetAllAsync(input);
        }
        protected override IQueryable<Project> CreateFilteredQuery(GetAllProjectsInput input) {
            var res = base.CreateFilteredQuery(input); 
            return projectManager.FilterProjectsByVisibility(res, session.UserId, input.IsPublic, input.IsAssigned);
        }

        public async Task<PagedResultDto<ProjectWithRolesDto>> GetAllIncludingRolesAsync(GetAllProjectsInput input) {
            CheckGetAllPermission();

            var query = repoProjects.GetAllIncludingRoles();
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            query = projectManager.FilterProjectsByVisibility(query, session.UserId, input.IsPublic, input.IsAssigned);
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

            query = projectManager.FilterProjectsByVisibility(query, session.UserId, input.IsPublic, input.IsAssigned);
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

            // Add the creator as a ProjectManager
            if(input.Users == null) {
                input.Users = new List<MinimalUserWithPRolesDto>();
            }
            var creatorDto = input.Users.FirstOrDefault(x => x.Id == session.UserId);
            if (creatorDto == null) {
                creatorDto = new MinimalUserWithPRolesDto {
                    Id = session.UserId.Value,
                    RoleNames = new List<string> { StaticProjectRoleNames.ProjectManager },
                }; 
                input.Users.Add(creatorDto);
            } else if(creatorDto.RoleNames == null){
                creatorDto.RoleNames = new List<string> { StaticProjectRoleNames.ProjectManager };
            } else {
                // The creator will always be a ProjectManager
                creatorDto.RoleNames.Add(StaticProjectRoleNames.ProjectManager);
            } 

            // Assign users 
            foreach (var user in input.Users) {
                ProjectUser pu = new ProjectUser { ProjectId = entity.Id, UserId = user.Id };
                if (user.RoleNames != null)
                    pu.Roles = await repoPRoles.GetAllListAsync(x => user.RoleNames.Contains(x.Name));

                await repoPUsers.InsertAsync(pu);
            } 

            return MapToEntityDto(entity);
        }
         
        public override async Task<ProjectDto> UpdateAsync(UpdateProjectInput input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId)
                projectManager.CheckProjectPermission(session.UserId, input.Id, StaticProjectPermissionNames.Project_Edit);

            // Add the creator as a ProjectManager
            /*if (input.Users == null) {
                input.Users = new List<MinimalUserWithPRolesDto>();
            }
            var creatorDto = input.Users.FirstOrDefault(x => x.Id == creatorId);
            if (creatorDto == null) {
                creatorDto = new MinimalUserWithPRolesDto {
                    Id = creatorId.Value,
                    RoleNames = new List<string> { StaticProjectRoleNames.ProjectManager },
                };
                input.Users.Add(creatorDto);
            } else if (creatorDto.RoleNames == null) {
                creatorDto.RoleNames = new List<string> { StaticProjectRoleNames.ProjectManager };
            } else {
                // The creator will always be a ProjectManager
                creatorDto.RoleNames.Add(StaticProjectRoleNames.ProjectManager);
            }*/
             
            // Delete users (BUT NOT THE CREATOR !)
            var inputIds = input.Users.Select(x => x.Id);
            await repoPUsers.DeleteAsync(x => x.ProjectId == input.Id && !inputIds.Contains(x.UserId) && x.UserId != creatorId); // !!!
            await CurrentUnitOfWork.SaveChangesAsync();

            // Update existing users
            var existingPUs = await repoPUsers.GetAllIncludingRoles().Where(x => x.ProjectId == input.Id).ToListAsync();
            foreach (var pu in existingPUs) {
                var user = input.Users.FirstOrDefault(x => x.Id == pu.UserId);
                     
                // The creator will always have the ProjectManager role
                if (user == null && pu.UserId != creatorId) { 
                    // There is an entity in the DB, but not in the input, that is not the creator
                    throw new Exception("There is an entity in the DB, but not in the input, that is not the creator");
                } else if (user == null) { 
                    // The creator was not provided
                    continue;
                } else if (pu.UserId == creatorId && !user.RoleNames.Contains(StaticProjectRoleNames.ProjectManager)) { 
                    // The creator was provided but he doesn't have the ProjectManager role
                    user.RoleNames.Add(StaticProjectRoleNames.ProjectManager);
                }

                if (user.RoleNames != null)
                    pu.Roles = await repoPRoles.GetAllListAsync(x => user.RoleNames.Contains(x.Name));
                await repoPUsers.UpdateAsync(pu);
            }

            // Add new users
            var assignedIds = projectManager.GetAssignedUserIds(input.Id);
            var newUsers = input.Users.Where(x => !assignedIds.Contains(x.Id));
            foreach (var user in newUsers) {
                ProjectUser pu = new ProjectUser { ProjectId = input.Id, UserId = user.Id };
                if (user.RoleNames != null)
                    pu.Roles = await repoPRoles.GetAllListAsync(x => user.RoleNames.Contains(x.Name));

                await repoPUsers.InsertAsync(pu);
            }

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
