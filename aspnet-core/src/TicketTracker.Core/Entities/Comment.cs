using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Comment : AuditedEntity<int, User> {
        [Required]
        public string Content { get; set; }
         
        public Ticket Ticket { get; set; }
        public int? TicketId { get; set; }

        // Relatie recursiva
        [ForeignKey("Parent")]
        public int? ParentId { get; set; }
        public Comment Parent { get; set; }

        public List<Comment> Children { get; set; }
    }
}
