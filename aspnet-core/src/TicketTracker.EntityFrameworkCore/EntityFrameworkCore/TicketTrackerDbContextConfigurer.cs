using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace TicketTracker.EntityFrameworkCore
{
    public static class TicketTrackerDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<TicketTrackerDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<TicketTrackerDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
