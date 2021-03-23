using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Users.Dto;

namespace TicketTracker.Works.Dto { 
    [AutoMap(typeof(Work))]
    public class SimpleWorkDto : EntityDto<int>, IHasSimpleUserDto {
        public SimpleUserDto User { get; set; } 

        public ushort? WorkedTime { get; set; }
        public ushort? EstimatedTime { get; set; }
    }
}
