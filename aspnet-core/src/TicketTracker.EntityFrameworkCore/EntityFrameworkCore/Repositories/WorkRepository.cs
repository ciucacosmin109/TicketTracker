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
    public class WorkRepository : TicketTrackerRepositoryBase<Work>, IRepository<Work> {
        public WorkRepository(IDbContextProvider<TicketTrackerDbContext> dbContextProvider)
            : base(dbContextProvider) {
        }

        public IQueryable<Work> GetAllIncludingInfo() {
            return Context.Works
                .Include(x => x.ProjectUser)
                    .ThenInclude(x => x.User)
                .Include(x => x.Ticket);
        }
        public Work GetIncludingInfo(int id) {
            return GetAllIncludingInfo().FirstOrDefault(x => x.Id == id);
        }
        public async Task<Work> GetIncludingInfoAsync(int id) {
            return await GetAllIncludingInfo().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task SetIsWorkingFalseAsync(int ticketId) {
            await Context.Database.ExecuteSqlRawAsync("UPDATE Works SET IsWorking='false' WHERE TicketId={0}", ticketId);
            await Context.SaveChangesAsync();
        }
        public async Task SetProjectUserNullAsync(int projectUserId) {
            await Context.Database.ExecuteSqlRawAsync("UPDATE Works SET ProjectUserId=NULL, IsWorking=0 WHERE ProjectUserId={0}", projectUserId);
            await Context.SaveChangesAsync();
        }
        public async Task SetTicketNullAsync(int ticketId) {
            await Context.Database.ExecuteSqlRawAsync("UPDATE Works SET TicketId=NULL, IsWorking=0 WHERE TicketId={0}", ticketId);
            await Context.SaveChangesAsync();
        }

    }
}
