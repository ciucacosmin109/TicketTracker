using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.ProjectRoles.Dto;
using TicketTracker.Projects.Dto.RoleDto;

namespace TicketTracker.Projects.Dto {
    [AutoMap(typeof(Project), typeof(ProjectDto))] 
    public class ProjectWithRolesDto : ProjectDto {
        public List<PRoleDto> Roles { get; set; } 
    }
}
