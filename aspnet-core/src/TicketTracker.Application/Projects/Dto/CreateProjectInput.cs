using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Projects.Dto.RoleDto;

namespace TicketTracker.Projects.Dto {
    [AutoMap(typeof(Project))]
    public class CreateProjectInput {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsPublic { get; set; }

        public List<MinimalUserWithPRolesDto> Users { get; set; }
    }
}
