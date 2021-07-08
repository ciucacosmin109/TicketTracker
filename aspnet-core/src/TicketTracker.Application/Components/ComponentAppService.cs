using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.ObjectMapping;
using Abp.Runtime.Session; 
using Microsoft.EntityFrameworkCore; 
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;
using TicketTracker.Components.Dto;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Managers;

namespace TicketTracker.Components {

    [AbpAuthorize]
    public class ComponentAppService : AsyncCrudAppService<Component, ComponentDto, int, GetAllComponentsInput, CreateComponentInput, UpdateComponentInput> {
        private readonly WorkRepository repoWorks;
        private readonly CommentRepository repoComments;
        private readonly ProjectManager projectManager;
        private readonly IAbpSession session;
        private readonly IObjectMapper mapper;

        public ComponentAppService(
            IRepository<Component> repository,
            WorkRepository repoWorks,
            CommentRepository repoComments,
            ProjectManager projectManager,
            IAbpSession session,
            IObjectMapper mapper
        ) : base(repository) {
            this.repoWorks = repoWorks;
            this.repoComments = repoComments;
            this.projectManager = projectManager;
            this.session = session;
            this.mapper = mapper;
            LocalizationSourceName = TicketTrackerConsts.LocalizationSourceName;
        }

        public override async Task<ComponentDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await Repository.GetAllIncluding(x => x.Project).FirstOrDefaultAsync(x => x.Id == input.Id);
            if(entity == null) {
                throw new EntityNotFoundException(typeof(Component), input.Id);
            }

            projectManager.CheckVisibility(session.UserId, entity.ProjectId); 
            return MapToEntityDto(entity);
        }

        public override async Task<PagedResultDto<ComponentDto>> GetAllAsync(GetAllComponentsInput input) {
            projectManager.CheckVisibility(session.UserId, input.ProjectId);
            var query = CreateFilteredQuery(input);
            var totalCount = await query.CountAsync();

            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            var res = await query.ToListAsync();
            return new PagedResultDto<ComponentDto> {
                Items = mapper.Map<List<ComponentDto>>(res),
                TotalCount = totalCount
            };
        }
        protected override IQueryable<Component> CreateFilteredQuery(GetAllComponentsInput input) {
            var query = Repository.GetAllIncluding(x => x.Project);

            query = query.Where(x => x.ProjectId == input.ProjectId);
            return query;
        }

        public override async Task<ComponentDto> CreateAsync(CreateComponentInput input) { 
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_AddComponents);
            return await base.CreateAsync(input);
        }

        public override async Task<ComponentDto> UpdateAsync(UpdateComponentInput input) {
            var entity = await Repository.GetAllIncluding(x => x.Project).FirstOrDefaultAsync(x => x.Id == input.Id);
            if (entity == null) {
                throw new EntityNotFoundException(typeof(Component), input.Id);
            }

            long? creatorId = entity.CreatorUserId;
            if (session.UserId != creatorId) {
                int pId = Repository.Get(input.Id).ProjectId;
                projectManager.CheckProjectPermission(session.UserId, pId, StaticProjectPermissionNames.Project_ManageComponents);
            }

            return await base.UpdateAsync(input);
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            var comp = await Repository
                .GetAllIncluding(x => x.Tickets)
                .FirstOrDefaultAsync(x => x.Id == input.Id); 
            if(comp == null) {
                throw new EntityNotFoundException(typeof(Component), input.Id);
            }

            // Check permissions
            if (session.UserId != comp.CreatorUserId) {
                int pId = Repository.Get(input.Id).ProjectId;
                projectManager.CheckProjectPermission(session.UserId, pId, StaticProjectPermissionNames.Project_ManageComponents);
            }

            // Set the ticketId for Work to null
            if (comp.Tickets != null) {
                foreach(var ticket in comp.Tickets){
                    await repoWorks.SetTicketNullAsync(ticket.Id);
                }
            }

            // Delete comments 
            await repoComments.DeleteByComponentIdAsync(input.Id);

            // Delete
            await base.DeleteAsync(input);
        }
    }
}
