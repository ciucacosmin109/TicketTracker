using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Tickets.Dto {
    public class GetAllTicketsInput : PagedAndSortedResultRequestDto {
        public int? ComponentId { get; set; }
        public int? ProjectId { get; set; }
    }
}
