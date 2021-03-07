using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.EntityFrameworkCore.Seed.Entities {
    public class InitialDataBuilder {
        private readonly TicketTrackerDbContext _context;

        public InitialDataBuilder(TicketTrackerDbContext context) {
            _context = context;
        }

        public void Create() {
            new DefaultActivityCreator(_context).Create(); 

            _context.SaveChanges();
        }
    }
}
