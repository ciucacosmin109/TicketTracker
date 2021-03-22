using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Component : AuditedEntity<int, User> {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        public Project Project { get; set; }
        public int ProjectId { get; set; }

        public List<Ticket> Tickets { get; set; }
    }
}
