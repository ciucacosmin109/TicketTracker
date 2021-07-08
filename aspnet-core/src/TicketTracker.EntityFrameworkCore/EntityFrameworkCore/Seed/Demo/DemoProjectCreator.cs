using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoProjectCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoProjectCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create(List<User> users) {
            Project p1 = CreateProject1(
                users[0].Id,
                new List<KeyValuePair<long, string>> {
                    new KeyValuePair<long, string>(users[0].Id, StaticProjectRoleNames.ProjectManager),
                    new KeyValuePair<long, string>(users[1].Id, StaticProjectRoleNames.Developer),
                    new KeyValuePair<long, string>(users[2].Id, StaticProjectRoleNames.Developer),
                    new KeyValuePair<long, string>(users[3].Id, StaticProjectRoleNames.Developer)
                }
            );
            Project p2 = CreateProject2(
                users[4].Id,
                new List<KeyValuePair<long, string>> {
                    new KeyValuePair<long, string>(users[4].Id, StaticProjectRoleNames.ProjectManager),
                    new KeyValuePair<long, string>(users[5].Id, StaticProjectRoleNames.Developer),
                    new KeyValuePair<long, string>(users[6].Id, StaticProjectRoleNames.Developer),
                    new KeyValuePair<long, string>(users[0].Id, StaticProjectRoleNames.Developer)
                }
            );
            CreateProject3(
                users[0].Id,
                new List<KeyValuePair<long, string>> {
                    new KeyValuePair<long, string>(users[0].Id, StaticProjectRoleNames.ProjectManager)
                }
            );
            CreateProject4(
                users[8].Id,
                new List<KeyValuePair<long, string>> {
                    new KeyValuePair<long, string>(users[8].Id, StaticProjectRoleNames.ProjectManager),
                    new KeyValuePair<long, string>(users[9].Id, StaticProjectRoleNames.Developer),
                    new KeyValuePair<long, string>(users[0].Id, null)
                }
            );
            CreateProject5(
                users[9].Id,
                new List<KeyValuePair<long, string>> {
                    new KeyValuePair<long, string>(users[9].Id, StaticProjectRoleNames.ProjectManager),
                    new KeyValuePair<long, string>(users[8].Id, StaticProjectRoleNames.Developer)
                }
            );

            var workBuilder = new DemoWorkBuilder(_context, _tenantId);
            workBuilder.Create(p1);
            workBuilder.Create(p2);
        }

        private List<ProjectUser> GetProjectUsersFromPair(long creatorUserId, List<KeyValuePair<long, string>> assignedUsers) {
            List<ProjectUser> pu = new List<ProjectUser>();
            foreach (var user in assignedUsers) {
                pu.Add(new ProjectUser {
                    CreatorUserId = creatorUserId,
                    UserId = user.Key,
                    Roles = _context.PRoles.Where(x => x.Name == user.Value).ToList()
                });
            }
            return pu;
        }
        public Project CreateProject1(long creatorUserId, List<KeyValuePair<long, string>> assignedUsers) {
            Project project = new Project {
                Name = "Copiuta",
                Description = "Aplicatie web, dezvoltata cu React.js si node.js, pentru gestiunea notitelor studenților.<br/><br/>Git repo: https://github.com/ciucacosmin109/Copiuta",
                IsPublic = true,
                CreatorUserId = creatorUserId,
                ProjectUsers = GetProjectUsersFromPair(creatorUserId, assignedUsers),
                Components = new DemoComponentCreator(_context, _tenantId).GetComponents1(creatorUserId),
            };
            _context.Projects.Add(project);
            _context.SaveChanges();

            return project;
        }
        public Project CreateProject2(long creatorUserId, List<KeyValuePair<long, string>> assignedUsers) {
            Project project = new Project {
                Name = "Ticket Tracker",
                Description = "Aplicatie pentru gestiunea tichetelor altor sisteme informatice.<br/><br/>Git repo: https://github.com/ciucacosmin109/TicketTracker",
                IsPublic = false,
                CreatorUserId = creatorUserId,
                ProjectUsers = GetProjectUsersFromPair(creatorUserId, assignedUsers),
                Components = new DemoComponentCreator(_context, _tenantId).GetComponents2(creatorUserId),
            };
            _context.Projects.Add(project);
            _context.SaveChanges();

            return project;
        }
        public Project CreateProject3(long creatorUserId, List<KeyValuePair<long, string>> assignedUsers) {
            Project project = new Project {
                Name = "Crypto Buddy",
                Description = "Sistem care administreaza portofoliul de investitii in cryptomonede si plaseaza tranzactii pentru a maximiza profitul",
                IsPublic = false,
                CreatorUserId = creatorUserId,
                ProjectUsers = GetProjectUsersFromPair(creatorUserId, assignedUsers),
                Components = null,
            };
            _context.Projects.Add(project);
            _context.SaveChanges();

            return project;
        }
        public Project CreateProject4(long creatorUserId, List<KeyValuePair<long, string>> assignedUsers) {
            Project project = new Project {
                Name = "Live score",
                Description = "Android application that tracks soccer scores",
                IsPublic = true,
                CreatorUserId = creatorUserId,
                ProjectUsers = GetProjectUsersFromPair(creatorUserId, assignedUsers),
                Components = null,
            };
            _context.Projects.Add(project);
            _context.SaveChanges();

            return project;
        }
        public Project CreateProject5(long creatorUserId, List<KeyValuePair<long, string>> assignedUsers) {
            Project project = new Project {
                Name = "Vrum vrum",
                Description = "Aplicatie pentru gestiunea pieselor utilajelor agricole dintr-un depozit",
                IsPublic = true,
                CreatorUserId = creatorUserId,
                ProjectUsers = GetProjectUsersFromPair(creatorUserId, assignedUsers),
                Components = null,
            };
            _context.Projects.Add(project);
            _context.SaveChanges();

            return project;
        }
    }
}
