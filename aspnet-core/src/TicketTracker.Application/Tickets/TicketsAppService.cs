using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Tickets.Dto;

namespace TicketTracker.Tickets {
    [AbpAuthorize]
    public class TicketsAppService {/* : AsyncCrudAppService<Ticket, TicketDto, int> {
        public TicketsAppService(
            IRepository<Ticket> repository) : base(repository) {

        }*/ 


    }
}
