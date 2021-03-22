using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Comments.Dto {
    public class GetAllCommentsInput : PagedAndSortedResultRequestDto {
        public int TicketId { get; set; }
    }
}
