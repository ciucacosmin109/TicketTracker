using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Users.Dto;

namespace TicketTracker.Files.Dto {
    [AutoMapFrom(typeof(File))]
    public class FileDto : CreationAuditedEntityDto<int> {
        public string Name { get; set; }
        public int Size { get; set; }
        public int? TicketId { get; set; }

        public FileUserDto CreatorUser { get; set; }
    }
}
