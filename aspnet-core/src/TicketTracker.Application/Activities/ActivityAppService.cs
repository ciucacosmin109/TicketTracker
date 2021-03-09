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
    public class ActivityAppService : AsyncCrudAppService<Activity, ActivityDto, int, PagedAndSortedResultRequestDto, CreateActivityInput, UpdateActivityInput> {
        public ActivityAppService(IRepository<Activity> repository) 
            : base(repository) {

        }
        protected void CheckStaticEntity(int id) {
            if (Repository.FirstOrDefault(id).IsStatic) {
                throw new UserFriendlyException("The entity can not be modified because it is marked as static");
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
