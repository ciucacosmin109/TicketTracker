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
using TicketTracker.Comments.Dto;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Managers;

namespace TicketTracker.Comments {
    [AbpAuthorize]
    public class CommentAppService : AsyncCrudAppService<Comment, CommentDto, int, GetAllCommentsInput, CreateCommentInput, UpdateCommentInput> {
        private readonly CommentRepository repoComments;
        private readonly ProjectManager projectManager;
        private readonly TicketManager ticketManager;
        private readonly CommentManager commentManager;
        private readonly IAbpSession session;

        public CommentAppService(
            CommentRepository repoComments,
            ProjectManager projectManager, 
            TicketManager ticketManager,
            CommentManager commentManager,
            IAbpSession session) : base(repoComments) {

            this.repoComments = repoComments;
            this.projectManager = projectManager;
            this.ticketManager = ticketManager;
            this.commentManager = commentManager;
            this.session = session;
        }


        public override async Task<CommentDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            commentManager.CheckViewCommentPermission(session.UserId, input.Id);

            return MapToEntityDto(entity);
        }

        public override async Task<PagedResultDto<CommentDto>> GetAllAsync(GetAllCommentsInput input) {
            ticketManager.CheckViewTicketPermission(session.UserId, input.TicketId);
            return await base.GetAllAsync(input);
        }
        protected override IQueryable<Comment> CreateFilteredQuery(GetAllCommentsInput input) { 
            return repoComments.GetAllIncludingChildren(input.TicketId); 
        }

        public async override Task<CommentDto> CreateAsync(CreateCommentInput input) {
            commentManager.CheckCommentPermission(session.UserId, input.TicketId.Value, StaticProjectPermissionNames.Ticket_AddComments);

            if(input.TicketId != null)
                ticketManager.CheckViewTicketPermission(session.UserId, input.TicketId.Value);
            else if(input.ParentId != null)
                commentManager.CheckViewCommentPermission(session.UserId, input.ParentId.Value);

            return await base.CreateAsync(input);
        }

        public override async Task<CommentDto> UpdateAsync(UpdateCommentInput input) {
            commentManager.CheckEditPermission(session.UserId, input.Id);
            return await base.UpdateAsync(input);
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            commentManager.CheckEditPermission(session.UserId, input.Id);
            await base.DeleteAsync(input);
        }
    }
}
