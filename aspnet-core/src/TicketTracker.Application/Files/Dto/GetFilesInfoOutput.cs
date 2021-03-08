using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Files.Dto {
    public class GetFilesInfoOutput {
        public int TicketId { get; set; }
        public List<FileDto> Files { get; set; }
    }
}
