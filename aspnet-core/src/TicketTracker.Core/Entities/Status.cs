using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Entities {
    public class Status : Entity<long> { 
        public string Name { get; set; }
    }
}
