using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.ProjectUsers.Dto {
    public class GetRolesOfUserInput {
        public long UserId { get; set; }
        public int ProjectId { get; set; }
    }
}
