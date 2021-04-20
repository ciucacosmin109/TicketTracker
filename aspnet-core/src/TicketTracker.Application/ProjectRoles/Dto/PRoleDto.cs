using Abp.Application.Services.Dto;
using Abp.AutoMapper; 
using System.ComponentModel.DataAnnotations; 
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.ProjectRoles.Dto {
    [AutoMap(typeof(PRole))]
    public class PRoleDto : EntityDto<int> {
        [Required]
        public string Name { get; set; } 
    }
}
