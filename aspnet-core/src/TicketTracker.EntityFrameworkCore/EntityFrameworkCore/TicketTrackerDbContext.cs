using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using TicketTracker.Authorization.Roles;
using TicketTracker.Authorization.Users;
using TicketTracker.MultiTenancy;

namespace TicketTracker.EntityFrameworkCore
{
    public class TicketTrackerDbContext : AbpZeroDbContext<Tenant, Role, User, TicketTrackerDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public TicketTrackerDbContext(DbContextOptions<TicketTrackerDbContext> options)
            : base(options)
        { 
        }
    }
}
