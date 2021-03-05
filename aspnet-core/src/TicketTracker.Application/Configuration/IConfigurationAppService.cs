using System.Threading.Tasks;
using TicketTracker.Configuration.Dto;

namespace TicketTracker.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
