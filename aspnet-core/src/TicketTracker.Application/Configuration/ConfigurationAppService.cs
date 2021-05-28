using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using TicketTracker.Configuration.Dto;
using TicketTracker.Configuration.Ui;

namespace TicketTracker.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : TicketTrackerAppServiceBase {
        private readonly IObjectMapper mapper;

        public ConfigurationAppService(
            IObjectMapper mapper
        ) {
            this.mapper = mapper;
        }

        public ListResultDto<UiThemeInfoDto> GetAllUiThemes() {
            return new ListResultDto<UiThemeInfoDto> {
                Items = mapper.Map<List<UiThemeInfoDto>>(UiThemes.All)
            };
        } 
        public async Task ChangeUiTheme(ChangeUiThemeInput input) {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }

    }
}
