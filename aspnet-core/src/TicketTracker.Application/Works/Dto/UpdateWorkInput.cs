using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Works.Dto {
    public class UpdateWorkInput : EntityDto<int> {
        public ushort? WorkedTime { get; set; }
        public ushort? EstimatedTime { get; set; }
    }
}
