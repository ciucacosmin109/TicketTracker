using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.Projects.Dto.RoleDto {
    [AutoMap(typeof(PRole))]
    public class PRoleDto : EntityDto<int>{
        [Required]
        public string Name { get; set; }  
    }
}
