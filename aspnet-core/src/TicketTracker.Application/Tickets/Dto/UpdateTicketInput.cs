using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Tickets.Dto { 
    [AutoMap(typeof(Ticket))]
    public class UpdateTicketInput : EntityDto<int> {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public TicketPriority Priority { get; set; }
        public TicketType Type { get; set; }

        public int ComponentId { get; set; }
        public int StatusId { get; set; }
        public int? ActivityId { get; set; }
    }
}
