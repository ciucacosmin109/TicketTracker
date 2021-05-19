using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Entities {
    public class Status : Entity<int> {
        [Required]
        public string Name { get; set; }
        public bool IsStatic { get; set; }
    }
}
