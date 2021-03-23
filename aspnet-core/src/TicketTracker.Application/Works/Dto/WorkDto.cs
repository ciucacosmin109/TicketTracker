using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.Tickets.Dto;
using TicketTracker.Users.Dto;

namespace TicketTracker.Works.Dto {
    [AutoMap(typeof(Work))]
    public class WorkDto : AuditedEntityDto<int>, IHasSimpleUserDto {
        public int ProjectUserId { get; set; } 
        public int TicketId { get; set; }

        public SimpleUserDto User { get; set; }
        public SimpleTicketDto Ticket { get; set; }

        public ushort? WorkedTime { get; set; }
        public ushort? EstimatedTime { get; set; } 
    }
}
