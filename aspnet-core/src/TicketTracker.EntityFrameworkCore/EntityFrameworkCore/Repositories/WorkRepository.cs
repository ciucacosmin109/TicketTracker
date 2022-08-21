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

        public async Task DeleteByProjectId(int projectId) {
            // Get Works that have projectUserId
            List<int> puIds = await Context.ProjectUsers
                .Where(x => x.ProjectId == projectId)
                .Select(x => x.Id)
                .ToListAsync();

            // Get Works that have ticketId
            List<int> tIds = await Context.Components
                .Include(x => x.Tickets)
                .Where(x => x.ProjectId == projectId)
                .SelectMany(x => x.Tickets)
                .Select(x => x.Id)
                .ToListAsync();

            // Delete :D
            List<Work> toDelete = await Context.Works
                .Where(x => 
                    puIds.Contains(x.ProjectUserId ?? 0) || 
                    tIds.Contains(x.TicketId ?? 0))
                .ToListAsync();

            if (toDelete != null) {
                Context.Works.RemoveRange(toDelete);
                await Context.SaveChangesAsync();
            }

            // Delete Works that does not have projectUserId or ticketId
            await Context.Database.ExecuteSqlRawAsync("DELETE FROM \"Works\" WHERE \"ProjectUserId\"=NULL AND \"TicketId\"=NULL");
            await Context.SaveChangesAsync();
        }

        public async Task SetIsWorkingFalseAsync(int ticketId) {
            await Context.Database.ExecuteSqlRawAsync("UPDATE \"Works\" SET \"IsWorking\"='false' WHERE \"TicketId\"={0}", ticketId);
            await Context.SaveChangesAsync();
        }
        public async Task SetProjectUserNullAsync(int projectUserId) {
            await Context.Database.ExecuteSqlRawAsync("UPDATE \"Works\" SET ProjectUserId=NULL, IsWorking=0 WHERE ProjectUserId={0}", projectUserId);
            await Context.SaveChangesAsync();
        }
        public async Task SetTicketNullAsync(int ticketId) {
            await Context.Database.ExecuteSqlRawAsync("UPDATE \"Works\" SET TicketId=NULL, IsWorking=0 WHERE TicketId={0}", ticketId);
            await Context.SaveChangesAsync();
        }

    }
}
