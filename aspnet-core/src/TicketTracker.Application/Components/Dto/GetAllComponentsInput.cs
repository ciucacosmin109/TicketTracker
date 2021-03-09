using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Components.Dto {
    public class GetAllComponentsInput : PagedAndSortedResultRequestDto {
        public int ProjectId { get; set; }
    }
}
