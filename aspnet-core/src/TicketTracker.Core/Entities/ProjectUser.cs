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
    public class ProjectUser : FullAuditedEntity<int, User> {
        public User User { get; set; } 
        public long UserId { get; set; }

        public Project Project { get; set; }
        public int ProjectId { get; set; }

        public List<PRole> Roles { get; set; } 
        public List<Work> Works { get; set; }

    }
}
