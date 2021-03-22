using System;
using System.Collections.Generic;
using Abp.Authorization.Users;
using Abp.Extensions;
using TicketTracker.Entities;

namespace TicketTracker.Authorization.Users
{
    public class User : AbpUser<User> {
        public const string DefaultPassword = "123qwe";

        public List<ProjectUser> UserProjects { get; set; }
        public List<Subscription> Subscriptions { get; set; }

        // Methods
        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }

        public static User CreateTenantAdminUser(int tenantId, string emailAddress)
        {
            var user = new User
            {
                TenantId = tenantId,
                UserName = AdminUserName,
                Name = AdminUserName,
                Surname = AdminUserName,
                EmailAddress = emailAddress,
                Roles = new List<UserRole>()
            };

            user.SetNormalizedNames();

            return user;
        }

        public override void SetNormalizedNames() {
            if(UserName != null)
                NormalizedUserName = UserName.ToUpperInvariant();
            if (EmailAddress != null)
                NormalizedEmailAddress = EmailAddress.ToUpperInvariant();
        }
    }
}
