using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using TicketTracker.Configuration;
using TicketTracker.Web;

namespace TicketTracker.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class TicketTrackerDbContextFactory : IDesignTimeDbContextFactory<TicketTrackerDbContext>
    {
        public TicketTrackerDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<TicketTrackerDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            TicketTrackerDbContextConfigurer.Configure(builder, configuration.GetConnectionString(TicketTrackerConsts.ConnectionStringName));

            return new TicketTrackerDbContext(builder.Options);
        }
    }
}
