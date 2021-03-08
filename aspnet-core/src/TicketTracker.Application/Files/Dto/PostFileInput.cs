using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Files.Dto {
    public class PostFileInput {
        public IFormFile File { get; set; }
        public int TicketId { get; set; }
    }
}
