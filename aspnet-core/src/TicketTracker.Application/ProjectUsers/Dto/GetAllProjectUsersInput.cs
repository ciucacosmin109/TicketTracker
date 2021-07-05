using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.ProjectUsers.Dto {
    public class GetAllProjectUsersInput : PagedResultRequestDto {
        public int? ProjectId { get; set; }
        public int? ComponentId { get; set; }
        public int? TicketId { get; set; }
    }
}
