using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; 
using TicketTracker.Entities;

namespace TicketTracker.Comments.Dto { 

    [AutoMap(typeof(Comment))]
    public class UpdateCommentInput : EntityDto<int> {
        [Required]
        public string Content { get; set; } 
    }
}
