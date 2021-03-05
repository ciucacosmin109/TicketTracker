using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using TicketTracker.Configuration.Dto;

namespace TicketTracker.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : TicketTrackerAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
