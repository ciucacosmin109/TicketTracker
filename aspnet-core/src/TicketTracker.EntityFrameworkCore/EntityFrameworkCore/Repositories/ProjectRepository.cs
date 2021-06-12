using Abp.Domain.Repositories;
using Abp.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.EntityFrameworkCore.Repositories {
    public class ProjectRepository : TicketTrackerRepositoryBase<Project>, IRepository<Project> {
        public ProjectRepository(IDbContextProvider<TicketTrackerDbContext> dbContextProvider) 
            : base(dbContextProvider) {
        }

        public IQueryable<Project> GetAllIncludingRoles() {
            return Context.Projects
                .Include(x => x.ProjectUsers)
                    .ThenInclude(x => x.Roles)
                        .ThenInclude(x => x.Permissions);
        } 

        public IQueryable<Project> GetAllIncludingCompAndTickets() {
            return Context.Projects
                .Include(x => x.Components)
                    .ThenInclude(x => x.Tickets);
        } 
    }
}
