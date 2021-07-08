using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoUserCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoUserCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public List<User> Create() { 
            const string defaultPassword = "123";
            const string emailDomain = "@defaulttenant.com";
            List<User> users = new List<User> {
                new User {
                    Name = "Marius Cosmin",
                    Surname = "Ciuca",
                    UserName = "cmc"
                },
                new User {
                    Name = "Robert Mihai",
                    Surname = "Chiriac",
                    UserName = "robertc"
                },
                new User {
                    Name = "Catalina",
                    Surname = "Ceban",
                    UserName = "catalinac"
                },
                new User {
                    Name = "Catalin",
                    Surname = "Nan",
                    UserName = "catalinn"
                },
                new User {
                    Name = "Anca",
                    Surname = "Moraru",
                    UserName = "ancam"
                },
                new User {
                    Name = "Bianca",
                    Surname = "Andreescu",
                    UserName = "biancaa"
                },
                new User {
                    Name = "Alexandru Valentin",
                    Surname = "Popescu",
                    UserName = "alexandrup"
                },
                new User {
                    Name = "Catalin",
                    Surname = "Cornea",
                    UserName = "catalinc"
                },
                new User {
                    Name = "Mihai",
                    Surname = "Pavel",
                    UserName = "mihaip"
                },
                new User {
                    Name = "Gheorghe",
                    Surname = "Popescu",
                    UserName = "gheorghep"
                },
            }; 

            foreach (var user in users) { 
                User dbUser = _context.Users
                    .IgnoreQueryFilters()
                    .FirstOrDefault(u => u.TenantId == _tenantId && u.UserName == user.UserName);

                if (dbUser == null) {  
                    user.EmailAddress = user.UserName + emailDomain;
                    user.SetNormalizedNames();

                    user.Password = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new PasswordHasherOptions())).HashPassword(user, defaultPassword);
                    user.IsEmailConfirmed = true;
                    user.IsActive = true;
                    user.TenantId = _tenantId;

                    _context.Users.Add(user);
                } else {
                    user.Id = dbUser.Id;
                }
                _context.SaveChanges();
            }

            return users;
        }
    }
}
