using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Activities.Dto;
using TicketTracker.Authorization;
using TicketTracker.Entities;

namespace TicketTracker.Activities {
    [AbpAuthorize]
    public class ActivityAppService : AsyncCrudAppService<Activity, ActivityDto, int, PagedAndSortedResultRequestDto, CreateActivityInput, UpdateActivityInput> {
        public ActivityAppService(IRepository<Activity> repository) 
            : base(repository) {

            LocalizationSourceName = TicketTrackerConsts.LocalizationSourceName;
        }
        protected void CheckStaticEntity(int id) {
            if (Repository.FirstOrDefault(id).IsStatic) { 
                throw new UserFriendlyException(
                    L("StaticEntityCantBeModified{0}{1}", "Activity", id)
                );
            }
        }

        [AbpAuthorize(PermissionNames.Pages_Activities)]
        public override Task<ActivityDto> CreateAsync(CreateActivityInput input) {
            return base.CreateAsync(input);
        }

        [AbpAuthorize(PermissionNames.Pages_Activities)]
        public override Task<ActivityDto> UpdateAsync(UpdateActivityInput input) {
            CheckStaticEntity(input.Id);
            return base.UpdateAsync(input);
        }

        [AbpAuthorize(PermissionNames.Pages_Activities)]
        public override Task DeleteAsync(EntityDto<int> input) {
            CheckStaticEntity(input.Id);
            return base.DeleteAsync(input);
        }
    }
}
