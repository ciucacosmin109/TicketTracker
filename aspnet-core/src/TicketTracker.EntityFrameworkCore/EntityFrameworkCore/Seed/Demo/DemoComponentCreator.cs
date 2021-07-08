using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoComponentCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoComponentCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public List<Component> GetComponents1(long creatorUserId) {
            var ticketCreator = new DemoTicketCreator(_context, _tenantId);

            return new List<Component> {
                new Component {
                    Name = "Frontend",
                    Description = "Aici se afla toate tichetele referitoare la interfata cu utilizatorul",
                    CreatorUserId = creatorUserId,
                    Tickets = ticketCreator.GetTickets11(creatorUserId)
                },
                new Component {
                    Name = "Backend",
                    Description = "Aici se afla toate tichetele referitoare la serverul aplicatiei",
                    CreatorUserId = creatorUserId,
                    Tickets = ticketCreator.GetTickets12(creatorUserId)
                },
                new Component {
                    Name = "Baza de date",
                    Description = "Aici se afla toate tichetele referitoare la baza de date",
                    CreatorUserId = creatorUserId,
                    Tickets = ticketCreator.GetTickets13(creatorUserId)
                },
            };
        }
        public List<Component> GetComponents2(long creatorUserId) {
            var ticketCreator = new DemoTicketCreator(_context, _tenantId);

            return new List<Component> {
                new Component {
                    Name = "Paginile aplicatiei",
                    Description = "Tichete legate de interfata cu utilizatorul",
                    CreatorUserId = creatorUserId,
                    Tickets = ticketCreator.GetTickets21(creatorUserId),
                },
                new Component {
                    Name = "Servicii frontend",
                    Description = "Tichete legate de serviciile care preiau datele de la server",
                    CreatorUserId = creatorUserId,
                    Tickets = null,
                },
                new Component {
                    Name = "Servicii backend",
                    Description = "Tichete legate de serviciile care pun la dispozitie datele stocate de server",
                    CreatorUserId = creatorUserId,
                    Tickets = ticketCreator.GetTickets23(creatorUserId),
                },
                new Component {
                    Name = "Repositories",
                    Description = "Tichete legate de preluarea, adaugarea, modificarea, stergerea datelor din baza de date ",
                    CreatorUserId = creatorUserId,
                    Tickets = null,
                },
            };
        }
    }
}
