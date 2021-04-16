using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.Users.Dto;

namespace TicketTracker.ProjectUsers.Dto {  
    public class GetProjectUsersOutput {
        public int ProjectId { get; set; } 
        public List<SimpleUserWithRolesDto> Users { get; set; }
    }
}
