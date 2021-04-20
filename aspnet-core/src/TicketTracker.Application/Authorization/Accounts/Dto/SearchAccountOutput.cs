using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Authorization.Accounts.Dto { 
    [AutoMapFrom(typeof(User))]
    public class SearchAccountOutput : EntityDto<long> {
        public string Name { get; set; }
        public string Surname { get; set; } 

        public string UserName { get; set; } 
    }
}
