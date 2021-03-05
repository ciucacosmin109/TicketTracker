using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Authorization.Accounts.Dto {
    [AutoMapFrom(typeof(User))]
    public class UpdateAccountOutput {  
        public string Name { get; set; }
          
        public string Surname { get; set; }
           
        public string EmailAddress { get; set; }
    }
}
