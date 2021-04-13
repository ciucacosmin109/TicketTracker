using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Activities.Dto;
using TicketTracker.Components.Dto;
using TicketTracker.Entities;
using TicketTracker.Statuses.Dto;
using TicketTracker.Works.Dto;

namespace TicketTracker.Tickets.Dto {
    [AutoMap(typeof(Ticket))]
    public class TicketDto : AuditedEntityDto<int> {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public TicketPriority Priority { get; set; }
        public TicketType Type { get; set; } 
         
        public SimpleStatusDto Status { get; set; }
        public SimpleActivityDto Activity { get; set; }
        public List<SimpleWorkDto> Works { get; set; }
    }
}
