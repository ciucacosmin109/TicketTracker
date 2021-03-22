using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Users.Dto;

namespace TicketTracker.ProjectUsers.Dto {
    [AutoMap(typeof(User))]
    public class SimpleUserWithRolesDto : SimpleUserDto { 
        public List<string> RoleNames { get; set; }
    }
}
