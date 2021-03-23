using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Users.Dto {
    public interface IHasSimpleUserDto {
        public SimpleUserDto User { get; set; }
    }
}
