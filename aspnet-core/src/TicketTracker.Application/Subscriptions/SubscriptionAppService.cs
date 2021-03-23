using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;
using TicketTracker.EntityFrameworkCore.Repositories;
using TicketTracker.Managers;
using TicketTracker.Subscriptions.Dto;

namespace TicketTracker.Subscriptions {
    [AbpAuthorize]
    public class SubscriptionAppService : IApplicationService {
        private readonly SubscriptionRepository repoSubs;
        private readonly TicketRepository repoTickets;
        private readonly IRepository<User, long> repoUsers;
        private readonly TicketManager ticketManager;
        private readonly IObjectMapper mapper;
        private readonly IUnitOfWorkManager uowManager;
        private readonly IAbpSession session;

        public SubscriptionAppService( 
            SubscriptionRepository repoSubs,
            TicketRepository repoTickets,
            IRepository<User, long> repoUsers,
            TicketManager ticketManager,
            IObjectMapper mapper,
            IUnitOfWorkManager uowManager,
            IAbpSession session
        ) {
            this.repoSubs = repoSubs;
            this.repoTickets = repoTickets;
            this.repoUsers = repoUsers;
            this.ticketManager = ticketManager;
            this.mapper = mapper;
            this.uowManager = uowManager;
            this.session = session;
        }

        public async Task<SubscriptionDto> GetSubscriptionAsync(Entity<int> input) {
            var entity = await repoSubs.GetIncludingInfoAsync(input.Id);
            if (entity.CreatorUserId != session.UserId) {
                ticketManager.CheckTicketPermission(session.UserId, entity.TicketId, StaticProjectPermissionNames.Ticket_ManageSubscriptions);
            }
            return mapper.Map<SubscriptionDto>(entity);
        }
        public async Task<bool> CheckSubscriptionAsync(CheckSubscriptionInput input) {
            try { 
                await repoSubs.GetAll().FirstAsync(x => x.UserId == input.UserId && x.TicketId == input.TicketId);
                return true;
            } catch { return false; } 
        }
        public async Task<SubscriptionDto> CreateWorkAsync(CreateSubscriptionInput input) { 
            try { await repoTickets.GetAsync(input.TicketId); }
            catch { throw new UserFriendlyException("There is no ticket with id=" + input.TicketId.ToString()); }

            if (session.UserId != input.UserId)
                ticketManager.CheckTicketPermission(session.UserId, input.TicketId, StaticProjectPermissionNames.Ticket_ManageSubscriptions); 

            try { await repoUsers.GetAsync(input.UserId); }
            catch { throw new UserFriendlyException("There is no user with id=" + input.UserId.ToString()); }

            bool exists = (await repoSubs.GetAllListAsync(x => x.UserId == input.UserId && x.TicketId == input.TicketId)).Count() > 0;
            if (exists) {
                throw new UserFriendlyException("The user with with id=" + input.UserId.ToString() + " is already subscribed to the ticket");
            }

            Subscription entity = mapper.Map<Subscription>(input);
            await repoSubs.InsertAndGetIdAsync(entity);
            await uowManager.Current.SaveChangesAsync();

            return mapper.Map<SubscriptionDto>(entity); 
        }
        public async Task DeleteWorkAsync(DeleteSubscriptionInput input) {
            bool isCreator = (await repoSubs.GetAll().FirstAsync(x => x.TicketId == input.TicketId && x.UserId == input.UserId)).CreatorUserId == session.UserId;
            if (!isCreator) {
                ticketManager.CheckTicketPermission(session.UserId, input.TicketId, StaticProjectPermissionNames.Ticket_ManageSubscriptions);
            }
            await repoSubs.DeleteAsync(x => x.TicketId == input.TicketId && x.UserId == input.UserId);
        }
    }
}
