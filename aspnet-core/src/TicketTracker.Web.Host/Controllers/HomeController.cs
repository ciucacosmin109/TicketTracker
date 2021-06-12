using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp;
using Abp.Extensions;
using Abp.Notifications;
using Abp.Timing;
using Abp.Web.Security.AntiForgery;
using TicketTracker.Controllers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using TicketTracker.Configuration;

namespace TicketTracker.Web.Host.Controllers
{
    public class HomeController : TicketTrackerControllerBase {
        private readonly IConfigurationRoot _appConfiguration;
        private readonly INotificationPublisher _notificationPublisher;

        public HomeController(
            IWebHostEnvironment env,
            INotificationPublisher notificationPublisher
        ) {
            _appConfiguration = env.GetAppConfiguration();
            _notificationPublisher = notificationPublisher;
        }

        public IActionResult Index() {
            var basePath = _appConfiguration.GetValue<string>("App:ServerRootAddress", "");
            basePath = basePath.EndsWith("/") ? basePath.RemovePostFix("/") : basePath;
            return Redirect($"{basePath}/swagger");
        }

        /// <summary>
        /// This is a demo code to demonstrate sending notification to default tenant admin and host admin uers.
        /// Don't use this code in production !!!
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task<ActionResult> TestNotification(string message = "")
        {
            if (message.IsNullOrEmpty())
            {
                message = "This is a test notification, created at " + Clock.Now;
            }

            var defaultTenantAdmin = new UserIdentifier(1, 2);
            var hostAdmin = new UserIdentifier(null, 1);

            await _notificationPublisher.PublishAsync(
                "App.SimpleMessage",
                new MessageNotificationData(message),
                severity: NotificationSeverity.Info,
                userIds: new[] { defaultTenantAdmin, hostAdmin }
            );

            return Content("Sent notification: " + message);
        }
    }
}
