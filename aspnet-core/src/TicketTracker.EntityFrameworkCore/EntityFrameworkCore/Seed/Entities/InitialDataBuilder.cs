using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.EntityFrameworkCore.Seed.Entities {
    public class InitialDataBuilder {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public InitialDataBuilder(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create() {
            new DefaultActivityCreator(_context, _tenantId).Create();
            new DefaultRolePermissionCreator(_context, _tenantId).Create();

            _context.SaveChanges();
        }
    }
}
