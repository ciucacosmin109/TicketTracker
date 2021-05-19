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
        private readonly int _tenantId;

        public DefaultActivityCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create() {
            if (_context.Activities.IgnoreQueryFilters().Count() == 0) {
                _context.Activities.Add(new Activity { Id = 1, Name = "Design", IsStatic = true });
                _context.Activities.Add(new Activity { Id = 2, Name = "Development", IsStatic = true });
                _context.Activities.Add(new Activity { Id = 3, Name = "Testing", IsStatic = true });
                _context.Activities.Add(new Activity { Id = 4, Name = "Documentation", IsStatic = true });
                _context.Activities.Add(new Activity { Id = 5, Name = "Deployment", IsStatic = true });

                _context.SaveChanges();
            } 
        }
    }
}
