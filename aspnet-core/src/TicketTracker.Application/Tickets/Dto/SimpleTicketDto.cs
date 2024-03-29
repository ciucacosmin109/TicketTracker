﻿using Abp.Application.Services.Dto;
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
    public class SimpleTicketDto : EntityDto<int> {
        [Required]
        public string Title { get; set; } 
        public TicketPriority Priority { get; set; }
        public TicketType Type { get; set; } 
    }
}
