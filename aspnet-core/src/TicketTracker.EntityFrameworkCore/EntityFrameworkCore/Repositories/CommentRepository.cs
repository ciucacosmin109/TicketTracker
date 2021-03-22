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
    public class CommentRepository : TicketTrackerRepositoryBase<Comment>, IRepository<Comment> {
        public CommentRepository(IDbContextProvider<TicketTrackerDbContext> dbContextProvider) 
            : base(dbContextProvider) {
        }

        public IQueryable<Comment> GetAllIncludingChildren(int ticketId) {  

            List<Comment> comentarii = Context.Comments
                .Include(s => s.Children)
                .ToList()
                .Where(s => s.TicketId == ticketId)
                .ToList();

            // Parcurgere in latime
            Queue<Comment> coada = new Queue<Comment>(comentarii);
            while (coada.Count > 0) {
                Comment parinte = coada.Dequeue();
                if (parinte.Children != null)
                    foreach (Comment copil in parinte.Children)
                        coada.Enqueue(copil);

                if (parinte.CreatorUserId != null)
                    parinte.CreatorUser = Context.Users.FirstOrDefault(s => s.Id == parinte.CreatorUserId);

            }

            return comentarii.AsQueryable();
        }
    }
}
