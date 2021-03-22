using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.Comments.Dto { 
    [AutoMap(typeof(Comment))]
    public class CreateCommentInput {
        [Required]
        public string Content { get; set; }

        public int? TicketId { get; set; }
        public int? ParentId { get; set; } 
    }
}
