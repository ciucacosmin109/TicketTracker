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

            LocalizationSourceName = TicketTrackerConsts.LocalizationSourceName;
        }


        public override async Task<CommentDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();
            commentManager.CheckVisibility(session.UserId, input.Id);

            var entity = repoComments.GetIncludingChildren(input.Id);
            return MapToEntityDto(entity);
        }

        public override async Task<PagedResultDto<CommentDto>> GetAllAsync(GetAllCommentsInput input) {
            ticketManager.CheckVisibility(session.UserId, input.TicketId);

            var comms = repoComments.GetAllIncludingChildren(input.TicketId).AsQueryable();
            var totalCount = comms.Count();

            comms = ApplySorting(comms, input);
            comms = ApplyPaging(comms, input);

            return new PagedResultDto<CommentDto>(
                totalCount, ObjectMapper.Map<List<CommentDto>>(comms)
            );
        }

        public async override Task<CommentDto> CreateAsync(CreateCommentInput input) {
            if(input.TicketId != null)
                ticketManager.CheckTicketPermission(session.UserId, input.TicketId.Value, StaticProjectPermissionNames.Ticket_AddComments);
            else if(input.ParentId != null)
                commentManager.CheckCommentPermission(session.UserId, input.ParentId.Value, StaticProjectPermissionNames.Ticket_AddComments);

            if (input.TicketId != null)
                ticketManager.CheckVisibility(session.UserId, input.TicketId.Value);
            else if(input.ParentId != null)
                commentManager.CheckVisibility(session.UserId, input.ParentId.Value);

            var entity = MapToEntity(input); 
            int id = await Repository.InsertAndGetIdAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();

            var res = Repository.GetAllIncluding(x => x.CreatorUser).FirstOrDefault(x => x.Id == id);
            return MapToEntityDto(res);
        }

        public override async Task<CommentDto> UpdateAsync(UpdateCommentInput input) {
            commentManager.CheckEditPermission(session.UserId, input.Id);

            var entity = ObjectMapper.Map<Comment>(input);
            await Repository.UpdateAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();

            var res = Repository.GetAllIncluding(x => x.CreatorUser).FirstOrDefault(x => x.Id == input.Id);
            return MapToEntityDto(res);
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            commentManager.CheckEditPermission(session.UserId, input.Id);
            await base.DeleteAsync(input);
        }
    }
}
