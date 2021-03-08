using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Files.Dto { 
    [AutoMapFrom(typeof(User))]
    public class FileUserDto : EntityDto<long> { 
        public string UserName { get; set; }
         
        public string Name { get; set; } 
        public string Surname { get; set; } 
        public string FullName { get; set; }
           
    }
}
