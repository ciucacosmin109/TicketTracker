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
    public class Comment : FullAuditedEntity<long, User> {
        [Required]
        public string Content { get; set; }

        public User User { get; set; }
        public long UserId { get; set; }

        public Ticket Ticket { get; set; }
        public long TicketId { get; set; }

        // Relatie recursiva
        [ForeignKey("Parinte")]
        public long? ParinteId { get; set; }
        public Comment Parinte { get; set; }

        public List<Comment> Copii { get; set; }
    }
}
