using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace TicketTracker.Controllers
{
    public abstract class TicketTrackerControllerBase: AbpController
    {
        protected TicketTrackerControllerBase()
        {
            LocalizationSourceName = TicketTrackerConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
