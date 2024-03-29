﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Managers;
using TicketTracker.Works.Dto;
 
using System.Linq.Dynamic.Core;
using Abp.Localization;
using Abp.Localization.Sources;

namespace TicketTracker.Works {
    [AbpAuthorize]
    public class WorkAppService : IApplicationService {
        private readonly WorkRepository repoWork;
        private readonly ProjectRepository repoProjects;
        private readonly TicketRepository repoTickets;
        private readonly ProjectUserRepository repoPUsers;
        private readonly WorkManager workManager;
        private readonly ProjectManager projectManager;
        private readonly TicketManager ticketManager;
        private readonly IObjectMapper mapper;
        private readonly IUnitOfWorkManager uowManager;
        private readonly IAbpSession session;
        private readonly ILocalizationManager loc;
        private readonly ILocalizationSource l;

        public WorkAppService(
            WorkRepository repoWorks,
            ProjectRepository repoProjects,
            TicketRepository repoTickets,
            ProjectUserRepository repoPUsers,
            WorkManager workManager,
            ProjectManager projectManager,
            TicketManager ticketManager, 
            IObjectMapper mapper,
            IUnitOfWorkManager uowManager,
            IAbpSession session,
            ILocalizationManager loc
        ) {
            this.repoWork = repoWorks;
            this.repoProjects = repoProjects;
            this.repoTickets = repoTickets;
            this.repoPUsers = repoPUsers;
            this.workManager = workManager;
            this.projectManager = projectManager;
            this.ticketManager = ticketManager;
            this.mapper = mapper;
            this.uowManager = uowManager;
            this.session = session;
            this.loc = loc;

            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public async Task<WorkDto> GetAsync(EntityDto<int> input) {
            var entity = await repoWork.GetIncludingInfoAsync(input.Id); 
            if (entity == null) {
                throw new EntityNotFoundException(typeof(Work), input.Id);
            } 
            workManager.CheckVisibility(session.UserId, input.Id);

            var dto = mapper.Map<WorkDto>(entity);
            workManager.PopulateWorkDtoWithUser(dto, entity.ProjectUser.User);
            return dto;
        }
        public async Task<WorkDto> GetWorkingAsync(GetWorkingInput input) {
            var entity = await repoWork.GetAllIncludingInfo().FirstOrDefaultAsync(x => x.TicketId == input.TicketId && x.IsWorking);

            if (entity != null) {
                workManager.CheckVisibility(session.UserId, entity.Id);

                var dto = mapper.Map<WorkDto>(entity);
                if(entity.ProjectUser != null) {
                    workManager.PopulateWorkDtoWithUser(dto, entity.ProjectUser.User);
                }
                return dto;
            } else {
                return null;
            }
        }
        public async Task<PagedResultDto<WorkDto>> GetAllAsync(GetAllWorksInput input) {
            if(input.TicketId == null && input.UserId == null) {
                throw new UserFriendlyException(l.GetString("Provide{0}{1}", "TicketId", "UserId"));
            }
             
            var query = repoWork.GetAllIncludingInfo();
            if (input.TicketId != null) {
                ticketManager.CheckVisibility(session.UserId, input.TicketId.Value);
                query = query.Where(x => x.TicketId == input.TicketId);
            }
            if (input.UserId != null) {
                List<int> myProjectIds = projectManager
                    .FilterProjectsByVisibility(repoProjects.GetAll(), session.UserId)
                    .Select(x => x.Id)
                    .ToList();

                List<int> visibleWorkIds = repoPUsers
                    .GetAllIncluding(x => x.Works)
                    .Where(x => x.UserId == input.UserId && myProjectIds.Contains(x.ProjectId))
                    .SelectMany(x => x.Works)
                    .Select(x => x.Id)
                    .ToList();
                 
                query = query.Where(x => visibleWorkIds.Contains(x.Id));
            }

            // Apply sorting and pagging
            if (!input.Sorting.IsNullOrWhiteSpace()) {
                query = query.OrderBy(input.Sorting);
            }
            int totalCount = query.Count();
            query = query.PageBy(input);

            // Return the result  
            var entities = await query.ToListAsync();
            var dtos = entities.Select(mapper.Map<WorkDto>).ToList();
            for (int i = 0; i < dtos.Count; i++) {
                if(entities[i].ProjectUser != null) {
                    workManager.PopulateWorkDtoWithUser(dtos[i], entities[i].ProjectUser.User);
                }
            }
            return new PagedResultDto<WorkDto>(
                totalCount, dtos
            );
        }
        
        public async Task<WorkDto> CreateAsync(CreateWorkInput input) { 
            // Ticket validations
            Ticket ticket = await repoTickets.GetAllIncluding(x => x.Component).FirstOrDefaultAsync(x => x.Id == input.TicketId); 
            if(ticket == null) { 
                throw new EntityNotFoundException(typeof(Ticket), input.TicketId);
            }

            int pId = ticket.Component.ProjectId;
            ProjectUser projectUser = repoPUsers.GetAllIncluding(x=>x.User).FirstOrDefault(x => x.ProjectId == pId && x.UserId == input.UserId);
            if(projectUser == null) {
                throw new UserFriendlyException(l.GetString("NotAssignedToProject{0}{1}", input.UserId, pId));
            }

            // User validations
            if (session.UserId != projectUser.UserId)
                projectManager.CheckProjectPermission(session.UserId, projectUser.ProjectId, StaticProjectPermissionNames.Ticket_AssignWork);
            else
                projectManager.CheckProjectPermission(session.UserId, projectUser.ProjectId, StaticProjectPermissionNames.Ticket_SelfAssignWork);

            // Work validations
            Work activeWork = repoWork.GetAllIncludingInfo().FirstOrDefault(x => x.ProjectUserId == projectUser.Id && x.TicketId == input.TicketId && x.IsWorking);
            if (activeWork != null) {
                throw new UserFriendlyException(l.GetString("UserIsAlreadyWorking{0}{1}", input.UserId, ticket.Id));
            }

            await repoWork.SetIsWorkingFalseAsync(input.TicketId); 

            // Insert
            Work entity = mapper.Map<Work>(input);
            entity.ProjectUserId = projectUser.Id;
            entity.IsWorking = true;
            await repoWork.InsertAndGetIdAsync(entity);
            await uowManager.Current.SaveChangesAsync();

            var dto = mapper.Map<WorkDto>(entity);
            workManager.PopulateWorkDtoWithUser(dto, projectUser.User);
            return dto;
        }
        public async Task<WorkDto> UpdateAsync(UpdateWorkInput input) {
            Work existingEntity = await repoWork.GetIncludingInfoAsync(input.Id);
            try {
                int pUserId = existingEntity.ProjectUserId.Value; // ex
                ProjectUser pUser = await repoPUsers.GetAsync(pUserId);

                if (session.UserId != pUser.UserId)
                    projectManager.CheckProjectPermission(session.UserId, pUser.ProjectId, StaticProjectPermissionNames.Ticket_AssignWork);
            } catch {
                if (existingEntity.TicketId != null) {
                    ticketManager.CheckTicketPermission(session.UserId, existingEntity.TicketId.Value, StaticProjectPermissionNames.Ticket_AssignWork);
                } else {
                    throw new UserFriendlyException("FailedToCheckWorkPermissions{0}" + input.Id);
                }
            }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously 
            var entity = await repoWork.UpdateAsync(input.Id, async x => {
                x.WorkedTime = input.WorkedTime;
                x.EstimatedTime = input.EstimatedTime;
            });
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously

            existingEntity.WorkedTime = entity.WorkedTime;
            existingEntity.EstimatedTime = entity.EstimatedTime;
            var dto = mapper.Map<WorkDto>(existingEntity);
            if(existingEntity.ProjectUser != null)
                workManager.PopulateWorkDtoWithUser(dto, existingEntity.ProjectUser.User);
            return dto;
        }
        public async Task UpdateIsWorkingAsync(UpdateIsWorkingInput input) {
            Ticket ticket = await repoTickets.GetAsync(input.TicketId);
            ticketManager.CheckTicketPermission(session.UserId, input.TicketId, StaticProjectPermissionNames.Ticket_AssignWork);
            await repoWork.SetIsWorkingFalseAsync(input.TicketId);

            if(input.WorkId != null) {
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously 
                var entity = await repoWork.UpdateAsync(input.WorkId.Value, async x => {
                    x.IsWorking = true;
                });
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
            }

        }
        public async Task DeleteAsync(EntityDto<int> input) {
            bool isCreator = (await repoWork.GetAsync(input.Id)).CreatorUserId == session.UserId;
            if (!isCreator) {
                workManager.CheckWorkPermission(session.UserId, input.Id, StaticProjectPermissionNames.Ticket_AssignWork);
            }
            await repoWork.DeleteAsync(input.Id);
        }
        
    }
}
