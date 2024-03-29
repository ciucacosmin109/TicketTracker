﻿using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Ticket : AuditedEntity<int, User> {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public TicketPriority Priority { get; set; }
        public TicketType Type { get; set; } 

        public Component Component { get; set; }
        public int ComponentId { get; set; }

        public Status Status { get; set; }
        public int StatusId { get; set; }

        public Activity Activity { get; set; }
        public int? ActivityId { get; set; }

        public List<Work> Works { get; set; }  
        public List<Subscription> Subscriptions { get; set; }  
        public List<Comment> Comments { get; set; }
        public List<File> Attachments { get; set; }
    }
}
