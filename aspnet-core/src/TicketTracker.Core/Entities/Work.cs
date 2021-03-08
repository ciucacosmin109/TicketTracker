﻿using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Work : FullAuditedEntity<long, User> {
        public ProjectUser ProjectUser { get; set; }
        public long ProjectUserId { get; set; }

        public Ticket Ticket { get; set; }
        public long TicketId { get; set; }

        public ushort? WorkedTime { get; set; }
        public ushort? EstimatedTime { get; set; }
        public short Priority { get; set; }

    }
}