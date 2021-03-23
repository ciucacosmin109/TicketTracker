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
    public class TicketRepository : TicketTrackerRepositoryBase<Ticket>, IRepository<Ticket> {
        public TicketRepository(IDbContextProvider<TicketTrackerDbContext> dbContextProvider)
            : base(dbContextProvider) {
        }

        public IQueryable<Ticket> GetAllIncludingBasicInfo() {
            return Context.Tickets 
                .Include(x => x.Status)
                .Include(x => x.Activity);
        }
        public Ticket GetIncludingBasicInfo(int id) {
            return GetAllIncludingBasicInfo().First(x => x.Id == id);
        }
        public async Task<Ticket> GetIncludingBasicInfoAsync(int id) {
            return await GetAllIncludingBasicInfo().FirstAsync(x => x.Id == id);
        }

        public IQueryable<Ticket> GetAllIncludingInfo() {
            return GetAllIncludingBasicInfo()
                .Include(x => x.Work)
                    .ThenInclude(x => x.ProjectUser)
                        .ThenInclude(x => x.User);
        }
        public Ticket GetIncludingInfo(int id) {
            return GetAllIncludingInfo().First(x => x.Id == id);
        }
        public async Task<Ticket> GetIncludingInfoAsync(int id) {
            return await GetAllIncludingInfo().FirstAsync(x => x.Id == id);
        }
    }
}
