using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;

namespace TicketTracker.Managers {
    public class ProjectManager : IDomainService {
        private readonly IRepository<Project> repoProjects;
        private readonly ProjectUserRepository repoPUsers; 

        public ProjectManager(
            IRepository<Project> repoProjects,
            ProjectUserRepository repoPUsers
        ) {
            this.repoProjects = repoProjects;
            this.repoPUsers = repoPUsers; 
        }
         
        public IQueryable<Project> FilterProjectsByVisibility(IQueryable<Project> query, long? userId, bool? showPublics = null ) {
            List<int> projectIds = this.GetAssignedProjectIds(userId);

            if (showPublics == null) {
                return query.Where(x => x.IsPublic || projectIds.Contains(x.Id));
            }

            query = query.Where(x => x.IsPublic == showPublics);
            if (!showPublics.Value) {
                query = query.Where(x => projectIds.Contains(x.Id));
            }

            return query;
        }

        public List<int> GetAssignedProjectIds(long? userId) {
            return repoPUsers.GetAll().Where(x => x.UserId == userId).Select(x => x.ProjectId).ToList();
        }

        public bool IsProjectCreator(long? userId, int projectId) { 
            return repoProjects.Get(projectId).CreatorUserId == userId;
        } 

        public void CheckVisibility(long? userId, int projectId) {
            Project project = repoProjects.Get(projectId);
            if (!project.IsPublic) {
                CheckProjectPermission(userId, projectId);
            }
        }

        public void CheckProjectPermission(long? userId, int projectId, string permissionName = null) {
            var isAssigned = repoPUsers.GetAll().Where(x => x.ProjectId == projectId && x.UserId == userId).Any();
            if (!isAssigned) {
                throw new AbpAuthorizationException("You are not assigned to this project");
            }

            if (permissionName != null) {
                /*List<int> roleIds = repoPUsers.GetAllIncluding(x => x.Roles)
                    .Where(x => x.ProjectId == projectId && x.UserId == userId)
                    .First()
                    .Roles
                    .Select(x => x.Id)
                    .ToList();

                bool ok = repoPRole.GetAllIncluding(x => x.Permissions)
                    .Where(x => roleIds.Contains(x.Id))
                    .Any(x =>
                        x.Permissions.Any(y => y.Name == permissionName)
                    );*/

                bool ok = repoPUsers.GetAllIncludingRoles()
                    .Where(x => x.ProjectId == projectId && x.UserId == userId)
                    .Any(x =>
                        x.Roles.Any(y =>
                            y.Permissions.Any(z => z.Name == permissionName)
                        )
                    );

                if (!ok) {
                    throw new AbpAuthorizationException("You don't have the required permission");
                }
            }
        }
    }
}
