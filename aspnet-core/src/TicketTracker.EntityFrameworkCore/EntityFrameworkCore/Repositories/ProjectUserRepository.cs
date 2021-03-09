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
    public class ProjectUserRepository : TicketTrackerRepositoryBase<ProjectUser>, IRepository<ProjectUser> {
        public ProjectUserRepository(IDbContextProvider<TicketTrackerDbContext> dbContextProvider) 
            : base(dbContextProvider) {
        }

        public IQueryable<ProjectUser> GetAllIncludingRoles() {
            return Context.ProjectUsers
                .Include(x=>x.Roles)
                    .ThenInclude(y=>y.Permissions);
        }
    }
}
