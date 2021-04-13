﻿using Abp.Domain.Repositories;
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
        public async Task SetIsWorkingFalse(int ticketId) { 
            await Context.Database.ExecuteSqlRawAsync("UPDATE Works SET IsWorking='false' WHERE TicketId={0}", ticketId); 
        }

    }
}