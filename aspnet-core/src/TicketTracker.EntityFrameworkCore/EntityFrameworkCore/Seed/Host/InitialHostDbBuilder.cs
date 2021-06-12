using Microsoft.Extensions.Configuration;

namespace TicketTracker.EntityFrameworkCore.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly TicketTrackerDbContext _context; 

        public InitialHostDbBuilder(
            TicketTrackerDbContext context 
        ) {
            _context = context; 
        }

        public void Create()
        {
            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
