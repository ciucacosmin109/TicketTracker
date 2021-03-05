using Abp.Authorization;
using TicketTracker.Authorization.Roles;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
