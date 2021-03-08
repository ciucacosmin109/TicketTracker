using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Subscription : FullAuditedEntity<int, User> {
        public User User { get; set; }
        public long UserId { get; set; }

        public Ticket Ticket { get; set; }
        public int TicketId { get; set; }
    }
}
