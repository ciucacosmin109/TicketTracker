using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Components.Dto {
    [AutoMap(typeof(Component))]
    public class ComponentDto : AuditedEntityDto<int> {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
         
        public int ProjectId { get; set; }
    }
}
