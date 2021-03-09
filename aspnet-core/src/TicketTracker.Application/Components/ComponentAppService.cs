using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Components.Dto;
using TicketTracker.Entities;

namespace TicketTracker.Components { 

    [AbpAuthorize]
    public class ComponentAppService : AsyncCrudAppService<Component, ComponentDto, int, GetAllComponentsInput, CreateComponentInput, UpdateComponentInput> {
        public ComponentAppService(IRepository<Component, int> repository) : base(repository) {
        } 

        public override async Task<ComponentDto> GetAsync(EntityDto<int> input) { 
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            //CheckViewProjectPermission(session.UserId, input.Id, entity.IsPublic);

            return MapToEntityDto(entity);
        }
    }
}
