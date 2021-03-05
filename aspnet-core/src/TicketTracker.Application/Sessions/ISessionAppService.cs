using System.Threading.Tasks;
using Abp.Application.Services;
using TicketTracker.Sessions.Dto;

namespace TicketTracker.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
