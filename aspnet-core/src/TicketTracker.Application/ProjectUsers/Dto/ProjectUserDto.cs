using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Authorization.Users;
using TicketTracker.Users.Dto;
using TicketTracker.ProjectRoles.Dto;

namespace TicketTracker.ProjectUsers.Dto {
    [AutoMap(typeof(ProjectUser))]
    public class ProjectUserDto : EntityDto<int> {
        public int ProjectId { get; set; }
        public SimpleUserDto User { get; set; } 
        public List<PRoleWithPermissionsDto> Roles { get; set; }
    }
}
