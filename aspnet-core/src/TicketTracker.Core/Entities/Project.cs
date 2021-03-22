using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Project : AuditedEntity<int, User> { 
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsPublic { get; set; }

        public List<ProjectUser> ProjectUsers { get; set; }
        public List<Component> Components { get; set; }

    }
}
