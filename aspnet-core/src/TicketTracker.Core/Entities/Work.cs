using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Work : AuditedEntity<int, User> {
        public ProjectUser ProjectUser { get; set; }
        public int ProjectUserId { get; set; }

        public Ticket Ticket { get; set; }
        public int TicketId { get; set; }

        public bool IsWorking { get; set; }
        public ushort? WorkedTime { get; set; }
        public ushort? EstimatedTime { get; set; } 

    }
}
