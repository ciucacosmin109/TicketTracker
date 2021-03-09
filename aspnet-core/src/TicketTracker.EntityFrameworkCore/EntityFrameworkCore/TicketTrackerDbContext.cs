using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using TicketTracker.Authorization.Roles;
using TicketTracker.Authorization.Users;
using TicketTracker.MultiTenancy;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.EntityFrameworkCore
{
    public class TicketTrackerDbContext : AbpZeroDbContext<Tenant, Role, User, TicketTrackerDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<Activity> Activities { get; set; } 
        public DbSet<File> Atachments { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Work> Works { get; set; }
        public DbSet<Component> Components { get; set; }

        public DbSet<PRole> PRoles { get; set; }
        public DbSet<PPermission> PPermissions { get; set; } 

        public TicketTrackerDbContext(DbContextOptions<TicketTrackerDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>()
                .HasMany(x => x.UserProjects)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired();

            modelBuilder.Entity<User>()
                .HasMany(x => x.Comments)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired();

            modelBuilder.Entity<User>()
                .HasMany(x => x.Subscriptions)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired();

            // Ticket - Work
            modelBuilder.Entity<Ticket>()
                .HasOne(x => x.Work)
                .WithOne(x => x.Ticket)
                .HasForeignKey<Work>(x => x.TicketId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Activity>()
                .HasIndex(x => x.Name)
                .IsUnique();
            modelBuilder.Entity<PRole>()
                .HasIndex(x => x.Name)
                .IsUnique();
            modelBuilder.Entity<PPermission>()
                .HasIndex(x => x.Name)
                .IsUnique();
            modelBuilder.Entity<File>()
                .HasIndex(x => new { x.Name, x.TicketId })
                .IsUnique();
            modelBuilder.Entity<ProjectUser>()
                .HasIndex(x => new { x.UserId, x.ProjectId })
                .IsUnique();
            modelBuilder.Entity<Subscription>()
                .HasIndex(x => new { x.UserId, x.TicketId })
                .IsUnique();
            modelBuilder.Entity<Work>()
                .HasIndex(x => new { x.ProjectUserId, x.TicketId })
                .IsUnique();
        }
    }
}
