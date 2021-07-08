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

        public List<Comment> GetAllIncludingChildren(int ticketId) {
            List<Comment> comentarii = Context.Comments
                .Include(s => s.Children)
                .ToList()
                .Where(s => s.TicketId == ticketId)
                .ToList();

            // Parcurgere in latime
            Queue<Comment> coada = new Queue<Comment>(comentarii);
            while (coada.Count > 0) {
                Comment parinte = coada.Dequeue();
                foreach (Comment copil in parinte.Children)
                    coada.Enqueue(copil);

                if (parinte.CreatorUserId != null)
                    parinte.CreatorUser = Context.Users.FirstOrDefault(s => s.Id == parinte.CreatorUserId);
            }

            return comentarii;
        }
        public Comment GetIncludingChildren(int id) {
            Comment com = Context.Comments
                .Include(s => s.Children)
                .ToList()
                .FirstOrDefault(s => s.Id == id);

            // Parcurgere in latime
            Queue<Comment> coada = new Queue<Comment>();
            coada.Enqueue(com);
            while (coada.Count > 0) {
                Comment parinte = coada.Dequeue();
                foreach (Comment copil in parinte.Children)
                    coada.Enqueue(copil);

                if (parinte.CreatorUserId != null)
                    parinte.CreatorUser = Context.Users.FirstOrDefault(s => s.Id == parinte.CreatorUserId);
            }

            return com;
        }

        private async Task DeleteHierarchyAsync(Comment comment) {
            if(comment.Children == null || comment.Children.Count == 0) {
                Context.Comments.Remove(comment);
                await Context.SaveChangesAsync();
            } else {
                foreach(var c in comment.Children.ToList()) {
                    await this.DeleteHierarchyAsync(c);
                }
            }
        }
        public override async Task DeleteAsync(Comment comment) {
            Comment com = Context.Comments
                .Include(s => s.Children)
                .ToList()
                .FirstOrDefault(s => s.Id == comment.Id);

            await this.DeleteHierarchyAsync(com);
        }
        public override async Task DeleteAsync(int id) {
            Comment com = Context.Comments
                .Include(s => s.Children)
                .ToList()
                .FirstOrDefault(s => s.Id == id);

            await this.DeleteHierarchyAsync(com);
        }
        public async Task DeleteByTicketIdAsync(int id) {
            List<Comment> coms = Context.Comments
                .Include(s => s.Children)
                .ToList()
                .FindAll(x => x.TicketId == id);

            foreach (var c in coms) {
                await this.DeleteHierarchyAsync(c);
            }
        }
        public async Task DeleteByComponentIdAsync(int id) {
            var tickets = Context.Tickets
                .Where(x => x.ComponentId == id)
                .Select(x => x.Id)
                .ToList();

            foreach (var tid in tickets) {
                await this.DeleteByTicketIdAsync(tid);
            }
        }
        public async Task DeleteByProjectIdAsync(int id) {
            var components = Context.Components
                .Where(x => x.ProjectId == id)
                .Select(x => x.Id)
                .ToList();

            foreach (var cid in components) {
                await this.DeleteByComponentIdAsync(cid);
            }
        }
    }
}
