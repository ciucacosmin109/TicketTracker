using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.ProjectUsers.Dto {
    [AutoMap(typeof(ProjectUser))]
    public class ProjectUserDto : EntityDto<int> { 
        public long UserId { get; set; } 
        public int ProjectId { get; set; }
    }
}
