using Abp.Authorization;
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
    public class CommentManager : IDomainService {
        private readonly ProjectManager projectManager; 
        private readonly IRepository<Ticket> repoTickets;
        private readonly IRepository<Comment> repoComments;
        private readonly IRepository<Component> repoComponents;
        private readonly ILocalizationManager loc;
        private readonly ILocalizationSource l;

        public CommentManager(
            ProjectManager projectManager, 
            IRepository<Ticket> repoTickets,
            IRepository<Comment> repoComments,
            IRepository<Component> repoComponents,
            ILocalizationManager loc
        ) {
            this.projectManager = projectManager; 
            this.repoTickets = repoTickets;
            this.repoComments = repoComments;
            this.repoComponents = repoComponents;
            this.loc = loc;

            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public void CheckVisibility(long? userId, int commentId) {
            CheckCommentPermission(userId, commentId);
        } 
        public void CheckCommentPermission(long? userId, int commentId, string permissionName = null) {
            Comment comm = repoComments.Get(commentId);

            if (comm.TicketId != null) {
                int componentId = repoTickets.Get(comm.TicketId.Value).ComponentId;
                int projectId = repoComponents.Get(componentId).ProjectId;
                projectManager.CheckProjectPermission(userId, projectId, permissionName);
            }
            else if (comm.ParentId != null) {
                CheckCommentPermission(userId, comm.ParentId.Value, permissionName);
            }
            else throw new AbpAuthorizationException(
                l.GetString("FailedToCheckPermissions")
            );
        }

        public void CheckEditPermission(long? userId, int commentId) {
            bool isCreator = userId == repoComments.Get(commentId).CreatorUserId;

            if (!isCreator) {
                try {
                    CheckCommentPermission(userId, commentId, StaticProjectPermissionNames.Ticket_ManageComments);
                }
                catch {
                    throw new AbpAuthorizationException(l.GetString("NotTheCreatorOrNoPermissions{0}{1}", "Comment", commentId));
                }
            }
        }

    }
}
