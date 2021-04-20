using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities.ProjectAuthorization;

namespace TicketTracker.ProjectRoles.Dto {
    [AutoMap(typeof(PRole))]
    public class PRoleWithPermissionsDto : PRoleDto {
        public List<string> PermissionNames { get; set; }
    }
}
