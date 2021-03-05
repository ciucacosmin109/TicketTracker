using System.Threading.Tasks;
using Abp.Application.Services;
using TicketTracker.Authorization.Accounts.Dto;

namespace TicketTracker.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input); 
        Task<RegisterOutput> Register(RegisterInput input);

        Task ChangeLanguage(ChangeUserLanguageDto input); 
        Task<bool> ChangePassword(ChangePasswordDto input);
    }
}
