using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Ticket : FullAuditedEntity<long, User> {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public short? Priority { get; set; }

        public Component Component { get; set; }
        public long ComponentId { get; set; }

        public Status Status { get; set; }
        public long StatusId { get; set; }

        public Activity Activity { get; set; }
        public long ActivityId { get; set; }

        public Work Work { get; set; }  
        public List<Subscription> Subscriptions { get; set; }  
        public List<Comment> Comments { get; set; }
        public List<Attachment> Attachments { get; set; }
    }
}
