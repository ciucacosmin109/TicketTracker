using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Subscriptions.Dto {
    public class DeleteSubscriptionInput {
        public long UserId { get; set; }
        public int TicketId { get; set; }
    }
}
