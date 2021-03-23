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
    public class SubscriptionRepository : TicketTrackerRepositoryBase<Subscription>, IRepository<Subscription> {
        public SubscriptionRepository(IDbContextProvider<TicketTrackerDbContext> dbContextProvider)
            : base(dbContextProvider) {
        }
         
        public IQueryable<Subscription> GetAllIncludingInfo() {
            return Context.Subscriptions
                .Include(x => x.User)
                .Include(x => x.Ticket);
        }
        public Subscription GetIncludingInfo(int id) {
            return GetAllIncludingInfo().First(x => x.Id == id);
        }
        public async Task<Subscription> GetIncludingInfoAsync(int id) {
            return await GetAllIncludingInfo().FirstAsync(x => x.Id == id);
        }
    }
}
