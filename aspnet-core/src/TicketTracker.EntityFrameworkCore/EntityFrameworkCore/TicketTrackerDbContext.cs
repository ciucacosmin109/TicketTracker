﻿using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using TicketTracker.Authorization.Roles;
using TicketTracker.Authorization.Users;
using TicketTracker.MultiTenancy;
using TicketTracker.Entities;

namespace TicketTracker.EntityFrameworkCore
{
    public class TicketTrackerDbContext : AbpZeroDbContext<Tenant, Role, User, TicketTrackerDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<Activity> Activities { get; set; } 
        public DbSet<Attachment> Atachments { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Work> Works { get; set; }
        public DbSet<Component> Components { get; set; }

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

        }
    }
}
