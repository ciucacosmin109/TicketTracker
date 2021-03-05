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
    [AutoMapTo(typeof(User))]
    public class UpdateAccountInput {
        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }
         
        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }
         
    }
}
