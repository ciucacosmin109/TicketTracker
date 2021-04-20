using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Projects.Dto.RoleDto {
    public class MinimalUserWithPRolesDto : EntityDto<long>{ 
        public List<string> RoleNames { get; set; }
    }
}
