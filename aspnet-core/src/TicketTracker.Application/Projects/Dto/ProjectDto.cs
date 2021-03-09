using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Projects.Dto {
    [AutoMap(typeof(Project))]
    public class ProjectDto : AuditedEntityDto<int> {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsPublic { get; set; }

    }
}
