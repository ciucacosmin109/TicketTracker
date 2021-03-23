using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Tickets.Dto;
using TicketTracker.Users.Dto;

namespace TicketTracker.Subscriptions.Dto {
    [AutoMap(typeof(Subscription))]
    public class SubscriptionDto : AuditedEntityDto<int> {
        public long UserId { get; set; } 
        public int TicketId { get; set; }

        public SimpleUserDto User { get; set; }
        public SimpleTicketDto Ticket { get; set; }
    }
}
