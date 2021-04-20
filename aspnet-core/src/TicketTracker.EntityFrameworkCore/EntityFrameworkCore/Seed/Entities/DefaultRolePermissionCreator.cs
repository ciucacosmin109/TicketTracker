using Abp.Authorization.Roles;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks; 
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.EntityFrameworkCore.Seed.Entities {
    public class DefaultRolePermissionCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DefaultRolePermissionCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create() {
            var roles = _context.PRoles.IgnoreQueryFilters().Count();
            var perm = _context.PPermissions.IgnoreQueryFilters().Count();

            if (roles == 0 && perm == 0) {
                // Insert all permissions into the db
                var allPermissions = new List<PPermission> {
                    //0 
                    new PPermission { Name = StaticProjectPermissionNames.Project_Edit, IsStatic = true }, 
                    new PPermission { Name = StaticProjectPermissionNames.Project_AddComponents, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Project_ManageComponents, IsStatic = true },

                    //4
                    new PPermission { Name = StaticProjectPermissionNames.Component_AddTickets, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Component_ManageTickets, IsStatic = true },

                    //6
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_AddComments, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_ManageComments, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_AddAttachments, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_ManageAttachments, IsStatic = true },
                    
                    //10
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_Subscribe, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_ManageSubscriptions, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_AssignWork, IsStatic = true },
                    new PPermission { Name = StaticProjectPermissionNames.Ticket_SelfAssignWork, IsStatic = true },
                };
                _context.PPermissions.AddRange(allPermissions);
                _context.SaveChanges();

                // Setup roles 
                _context.PRoles.Add(new PRole {
                    Name = StaticProjectRoleNames.ProjectManager,
                    IsStatic = true,
                    Permissions = allPermissions
                });
                _context.PRoles.Add(new PRole {
                    Name = StaticProjectRoleNames.Developer,
                    IsStatic = true,

                    Permissions = new List<PPermission> {
                        allPermissions[1], allPermissions[2], 
                        allPermissions[3], allPermissions[4], 
                        allPermissions[5],
                        allPermissions[7], 
                        allPermissions[9], allPermissions[12]
                    }
                }); 
                _context.PRoles.Add(new PRole {
                    Name = StaticProjectRoleNames.TicketSubmitter,
                    IsStatic = true,

                    Permissions = new List<PPermission> {
                        allPermissions[3],
                        allPermissions[5],
                        allPermissions[7],
                        allPermissions[9]
                    }
                });

                _context.SaveChanges(); 
            }
        }
    }
}
