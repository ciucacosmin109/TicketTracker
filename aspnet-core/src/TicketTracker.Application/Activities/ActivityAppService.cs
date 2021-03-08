using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Activities.Dto;
using TicketTracker.Authorization;
using TicketTracker.Entities;

namespace TicketTracker.Activities {
    public class ActivityAppService : AsyncCrudAppService<Activity, ActivityDto, int, PagedResultRequestDto, CreateActivityInput, ActivityDto> {
        public ActivityAppService(IRepository<Activity> repository) 
            : base(repository) {

        }

        [AbpAuthorize(PermissionNames.Pages_Activities)]
        public override Task<ActivityDto> CreateAsync(CreateActivityInput input) {
            return base.CreateAsync(input);
        }
        [AbpAuthorize(PermissionNames.Pages_Activities)]
        public override Task<ActivityDto> UpdateAsync(ActivityDto input) {
            return base.UpdateAsync(input);
        }
        [AbpAuthorize(PermissionNames.Pages_Activities)]
        public override Task DeleteAsync(EntityDto<int> input) {
            return base.DeleteAsync(input);
        }
    }
}
