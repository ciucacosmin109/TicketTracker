using System.Threading.Tasks;
using TicketTracker.Models.TokenAuth;
using TicketTracker.Web.Controllers;
using Shouldly;
using Xunit;

namespace TicketTracker.Web.Tests.Controllers
{
    public class HomeController_Tests: TicketTrackerWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}