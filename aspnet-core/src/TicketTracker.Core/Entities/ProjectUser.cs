using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Roles;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.Entities {
    public class ProjectUser : FullAuditedEntity<long, User> {
        public User User { get; set; } 
        public long UserId { get; set; }

        public Project Project { get; set; }
        public long ProjectId { get; set; }

        public PRole Role { get; set; }
        public int? RoleId { get; set; }

        public List<Work> Works { get; set; }

    }
}
