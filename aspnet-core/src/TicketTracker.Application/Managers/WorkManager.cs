using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.ObjectMapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Users.Dto;
using TicketTracker.Works.Dto;

namespace TicketTracker.Managers {
    public class WorkManager : IDomainService {
        private readonly ProjectManager projectManager;
        private readonly WorkRepository repoWorks;
        private readonly IRepository<Ticket> repoTickets;
        private readonly IRepository<ProjectUser> repoPUsers;
        private readonly IObjectMapper mapper;

        public WorkManager(
            ProjectManager projectManager,
            WorkRepository repoWorks,
            IRepository<Ticket> repoTickets,
            IRepository<ProjectUser> repoPUsers,
            IObjectMapper mapper
        ) {
            this.projectManager = projectManager;
            this.repoWorks = repoWorks;
            this.repoTickets = repoTickets;
            this.repoPUsers = repoPUsers;
            this.mapper = mapper;
        }
         
        public void CheckViewWorkPermission(long? userId, int workId) {
            CheckWorkPermission(userId, workId, null);
        }
        public void CheckWorkPermission(long? userId, int workId, string permissionName = null) {
            int puId = repoWorks.Get(workId).ProjectUserId;
            int projectId = repoPUsers.Get(puId).ProjectId;

            projectManager.CheckProjectPermission(userId, projectId, permissionName);
        } 

        public WorkDto MapToDto(Work entity) {
            var dto = mapper.Map<WorkDto>(entity);
            if(entity.ProjectUser != null && entity.ProjectUser.User != null) {
                PopulateWorkDtoWithUser(dto, entity.ProjectUser.User);
            }

            return dto;
        }
        public void PopulateWorkDtoWithUser(IHasSimpleUserDto workDto, User user) {
            workDto.User = mapper.Map<SimpleUserDto>(user);
        } 
        public void PopulateWorkDtoWithUser(IHasSimpleUserDto workDto, int projectUserId) {
            var projectUser = repoPUsers.GetAllIncluding(x => x.User).First(x => x.Id == projectUserId);
            PopulateWorkDtoWithUser(workDto, projectUser.User);
        } 
         
    }
}
