using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        private readonly ProjectManager projectManager;
        private readonly IAbpSession session;

        public ComponentAppService(
            IRepository<Component, int> repository,
            WorkRepository repoWorks,
            ProjectManager projectManager,
            IAbpSession session) : base(repository) {
            this.repoWorks = repoWorks;
            this.projectManager = projectManager;
            this.session = session;

            LocalizationSourceName = TicketTrackerConsts.LocalizationSourceName;
        }

        public override async Task<ComponentDto> GetAsync(EntityDto<int> input) {
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            projectManager.CheckVisibility(session.UserId, entity.ProjectId);

            return MapToEntityDto(entity);
        }

        public override async Task<PagedResultDto<ComponentDto>> GetAllAsync(GetAllComponentsInput input) {
            projectManager.CheckVisibility(session.UserId, input.ProjectId);
            return await base.GetAllAsync(input);
        }
        protected override IQueryable<Component> CreateFilteredQuery(GetAllComponentsInput input) {
            var query = base.CreateFilteredQuery(input);

            query = query.Where(x => x.ProjectId == input.ProjectId);
            return query;
        }

        public override async Task<ComponentDto> CreateAsync(CreateComponentInput input) { 
            projectManager.CheckProjectPermission(session.UserId, input.ProjectId, StaticProjectPermissionNames.Project_AddComponents);
            return await base.CreateAsync(input);
        }

        public override async Task<ComponentDto> UpdateAsync(UpdateComponentInput input) {
            long? creatorId = (await Repository.GetAsync(input.Id)).CreatorUserId;
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

            // Delete
            await base.DeleteAsync(input);
        }
    }
}
