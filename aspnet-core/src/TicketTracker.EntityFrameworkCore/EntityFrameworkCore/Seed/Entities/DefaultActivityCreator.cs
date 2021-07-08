using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.Static;

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
                _context.Activities.Add(new Activity { Name = StaticActivityNames.Design, IsStatic = true });
                _context.Activities.Add(new Activity { Name = StaticActivityNames.Development, IsStatic = true });
                _context.Activities.Add(new Activity { Name = StaticActivityNames.Testing, IsStatic = true });
                _context.Activities.Add(new Activity { Name = StaticActivityNames.Documentation, IsStatic = true });
                _context.Activities.Add(new Activity { Name = StaticActivityNames.Deployment, IsStatic = true });

                _context.SaveChanges();
            } 
        }
    }
}
