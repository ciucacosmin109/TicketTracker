using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Works.Dto {
    [AutoMap(typeof(Work))]
    public class CreateWorkInput {
        public int UserId { get; set; }
        public int TicketId { get; set; }

        public bool IsWorking { get; set; }
        public ushort? WorkedTime { get; set; }
        public ushort? EstimatedTime { get; set; }
    }
}
