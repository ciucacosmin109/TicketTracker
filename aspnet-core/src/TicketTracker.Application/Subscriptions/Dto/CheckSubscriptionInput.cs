using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Subscriptions.Dto { 
    public class CheckSubscriptionInput {
        public long UserId { get; set; }
        public int TicketId { get; set; }

    }
}
