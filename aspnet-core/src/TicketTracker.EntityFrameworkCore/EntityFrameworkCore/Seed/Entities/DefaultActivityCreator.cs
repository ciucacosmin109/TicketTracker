using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.EntityFrameworkCore.Seed.Entities {
    public class DefaultActivityCreator {
        private readonly TicketTrackerDbContext _context;

        public DefaultActivityCreator(TicketTrackerDbContext context) {
            _context = context;
        }

        public void Create() {
            if (_context.Activities.IgnoreQueryFilters().Count() == 0) {
                _context.Activities.Add(new Activity { Name = "Design" });
                _context.Activities.Add(new Activity { Name = "Development" });
                _context.Activities.Add(new Activity { Name = "Testing" });
                _context.Activities.Add(new Activity { Name = "Documentation" });
                _context.Activities.Add(new Activity { Name = "Deployment" });

                _context.SaveChanges();
            } 
        }
    }
}
