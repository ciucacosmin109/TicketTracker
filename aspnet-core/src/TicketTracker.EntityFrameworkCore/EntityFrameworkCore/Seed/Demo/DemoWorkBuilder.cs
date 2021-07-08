using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.Static;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoWorkBuilder {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoWorkBuilder(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create(Project p) { 
            List<Ticket> tickets = p.Components 
                .Where(x => x.Tickets != null) // SelectMany nu merge cu val NULL
                .SelectMany(x => x.Tickets)
                .ToList();

            List<int> puIds = p.ProjectUsers 
                .Select(x => x.Id)
                .ToList();

            int k = 0;
            foreach (Ticket t in tickets) {
                _context.Works.Add(new Work {
                    CreatorUserId = p.CreatorUserId,
                    EstimatedTime = 120,
                    WorkedTime = (ushort)(t.Status.Name != StaticStatusNames.New ? 30 : 0),
                    IsWorking = true,
                    ProjectUserId = puIds[k],
                    TicketId = t.Id
                });

                k = (k + 1) % puIds.Count;
            }

            _context.SaveChanges();
        }
    }
}
