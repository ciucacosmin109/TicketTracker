﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Statuses.Dto;
using TicketTracker.Authorization;
using TicketTracker.Entities;

namespace TicketTracker.Statuses {
    [AbpAuthorize]
    public class StatusAppService : AsyncCrudAppService<Status, StatusDto, int, PagedAndSortedResultRequestDto, CreateStatusInput, UpdateStatusInput> {
        public StatusAppService(IRepository<Status> repository) 
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

        [AbpAuthorize(PermissionNames.Pages_Statuses)]
        public override Task<StatusDto> CreateAsync(CreateStatusInput input) {
            return base.CreateAsync(input);
        }

        [AbpAuthorize(PermissionNames.Pages_Statuses)]
        public override Task<StatusDto> UpdateAsync(UpdateStatusInput input) {
            CheckStaticEntity(input.Id);
            return base.UpdateAsync(input);
        }

        [AbpAuthorize(PermissionNames.Pages_Statuses)]
        public override Task DeleteAsync(EntityDto<int> input) {
            CheckStaticEntity(input.Id);
            return base.DeleteAsync(input);
        }
    }
}
