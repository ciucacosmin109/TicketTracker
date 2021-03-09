using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Projects.Dto {
    public class GetAllProjectsInput : PagedAndSortedResultRequestDto {
        public bool IsPublic { get; set; } = true;
    }
}
