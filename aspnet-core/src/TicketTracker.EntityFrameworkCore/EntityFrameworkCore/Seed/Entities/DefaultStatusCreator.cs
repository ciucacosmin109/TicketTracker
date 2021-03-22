using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.EntityFrameworkCore.Seed.Entities {
    public class DefaultStatusCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DefaultStatusCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create() { 
            if (_context.Statuses.IgnoreQueryFilters().Count() == 0) {
                _context.Statuses.Add(new Status { Name = "New", IsStatic = true });
                _context.Statuses.Add(new Status { Name = "In development", IsStatic = true });
                _context.Statuses.Add(new Status { Name = "In development (reopened)", IsStatic = true });
                _context.Statuses.Add(new Status { Name = "Solved", IsStatic = true });
                _context.Statuses.Add(new Status { Name = "Closed", IsStatic = true });

                _context.SaveChanges();
            }
        }
    }
}
