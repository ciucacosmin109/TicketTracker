using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Users.Dto;

namespace TicketTracker.Comments.Dto {
    [AutoMap(typeof(Comment))]
    public class CommentDto : EntityDto<int> { 
        [Required]
        public string Content { get; set; }
        public int? TicketId { get; set; }
        public int? ParentId { get; set; }

        public SimpleUserDto CreatorUser { get; set; }
        public DateTime CreationTime { get; set; }
        
        public List<CommentDto> Children { get; set; }
    }
}
