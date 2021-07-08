using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoDataBuilder {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoDataBuilder(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void ClearDatabase() {
            // The rest of the tables will be cleared by OnDelete.Cascade
            _context.Database.ExecuteSqlRaw("DELETE FROM Comments");
            _context.Database.ExecuteSqlRaw("DELETE FROM Works");
            _context.Database.ExecuteSqlRaw("DELETE FROM Projects");

            _context.SaveChanges();
        }

        public void Create() {
            ClearDatabase();

            // Create users
            List<User> users = new DemoUserCreator(_context, _tenantId).Create();

            // Create projects (with components, tickets, comments, files, Work)
            new DemoProjectCreator(_context, _tenantId).Create(users);
             
            // Save
            _context.SaveChanges();
        }
    }
}
