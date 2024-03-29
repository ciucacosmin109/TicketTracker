﻿using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Localization;
using Abp.Localization.Sources;
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
        private readonly ILocalizationManager loc;
        private readonly ILocalizationSource l;

        public ProjectManager(
            IRepository<Project> repoProjects,
            ProjectUserRepository repoPUsers, 
            ILocalizationManager loc
        ) {
            this.repoProjects = repoProjects;
            this.repoPUsers = repoPUsers;
            this.loc = loc;

            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public IQueryable<Project> FilterProjectsByVisibility(IQueryable<Project> query, long? userId, bool? arePublic = null, bool? areAssigned = null) {
            List<int> projectIds = this.GetAssignedProjectIds(userId); 
            query = query.Where(x => x.IsPublic || projectIds.Contains(x.Id));

            if (arePublic != null) {
                query = query.Where(x => x.IsPublic == arePublic);
                if (!arePublic.Value) {
                    query = query.Where(x => projectIds.Contains(x.Id));
                }
            }

            if (areAssigned != null) { 
                if(areAssigned.Value)
                    query = query.Where(x => projectIds.Contains(x.Id));
                else
                    query = query.Where(x => !projectIds.Contains(x.Id));
            }

            return query;
        }

        public List<int> GetAssignedProjectIds(long? userId) {
            return repoPUsers.GetAll().Where(x => x.UserId == userId).Select(x => x.ProjectId).ToList();
        }
        public List<long> GetAssignedUserIds(long? projectId) {
            return repoPUsers.GetAll().Where(x => x.ProjectId == projectId).Select(x => x.UserId).ToList();
        }

        public bool IsProjectCreator(long? userId, int projectId) { 
            return repoProjects.Get(projectId).CreatorUserId == userId;
        } 

        public void CheckVisibility(long? userId, int projectId) { 
            CheckProjectPermission(userId, projectId); 
        }

        public void CheckProjectPermission(long? userId, int projectId, string permissionName = null) {
            Project project = repoProjects.Get(projectId);
            if (!project.IsPublic) {
                var isAssigned = repoPUsers.GetAll().Where(x => x.ProjectId == projectId && x.UserId == userId).Any();
                if (!isAssigned) {
                    throw new AbpAuthorizationException(l.GetString("NotAssignedToProject{0}{1}", userId, projectId));
                }
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
                    throw new AbpAuthorizationException(l.GetString("NoPermissions{0}{1}", "Project", projectId));
                }
            }
        }
    }
}
