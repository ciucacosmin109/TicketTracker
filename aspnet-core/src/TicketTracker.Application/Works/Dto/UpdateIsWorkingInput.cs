using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Works.Dto {
    public class UpdateIsWorkingInput {
        public int TicketId { get; set; }
        public int? WorkId { get; set; }
    }
}
