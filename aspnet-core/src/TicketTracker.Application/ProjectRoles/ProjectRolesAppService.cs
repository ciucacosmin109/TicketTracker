﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.ObjectMapping;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.ProjectRoles.Dto;

namespace TicketTracker.ProjectRoles { 
    [AbpAuthorize]
    public class ProjectRolesAppService : IApplicationService {
        private readonly IRepository<PRole> repoPRoles;
        private readonly IObjectMapper mapper;
        private readonly ILocalizationManager loc;
        private readonly ILocalizationSource l;

        public ProjectRolesAppService(
            IRepository<PRole> repoPRoles,
            IObjectMapper mapper,
            ILocalizationManager loc
            ) {
            this.repoPRoles = repoPRoles;
            this.mapper = mapper;
            this.loc = loc;

            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public async Task<ListResultDto<PRoleDto>> GetAll() {
            var entities = await repoPRoles.GetAll().ToListAsync();
            return new ListResultDto<PRoleDto> {
                Items = mapper.Map<List<PRoleDto>>(entities)
            };
        }
        public async Task<ListResultDto<PRoleWithPermissionsDto>> GetAllWithPermissions() {
            var entities = await repoPRoles.GetAllIncluding(x => x.Permissions).ToListAsync();
             
            var dtos = new List<PRoleWithPermissionsDto>();
            foreach (PRole role in entities) {
                dtos.Add(mapper.Map<PRoleWithPermissionsDto>(role));
                dtos.Last().PermissionNames = role.Permissions.Select(x => x.Name).ToList();
            }

            return new ListResultDto<PRoleWithPermissionsDto> {
                Items = dtos
            };
        }
    }
}
