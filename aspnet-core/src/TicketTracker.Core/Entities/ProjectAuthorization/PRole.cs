using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Entities.ProjectAuthorization {
    public class PRole : Entity<int> {
        [Required]
        public string Name { get; set; }
        public bool IsStatic { get; set; }

        public List<PPermission> Permissions { get; set; }
        public List<ProjectUser> ProjectUsers { get; set; }
    }
}
