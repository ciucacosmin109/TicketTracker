﻿using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Statuses.Dto {
    [AutoMap(typeof(Status))]
    public class StatusDto : EntityDto<int> {
        public string Name { get; set; }
        public bool IsStatic { get; set; }
    }
}
