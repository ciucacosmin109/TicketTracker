using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Users.Dto { 
    [AutoMapFrom(typeof(User))]
    public class SimpleUserDto : EntityDto<long> {
        public string UserName { get; set; }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }

        public bool IsActive { get; set; }
    }
}
