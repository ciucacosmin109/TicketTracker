using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Activities.Dto {
    [AutoMap(typeof(Activity))]
    public class ActivityDto : EntityDto<int> {
        public string Name { get; set; }
    }
}
