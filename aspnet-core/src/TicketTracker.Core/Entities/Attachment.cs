using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;

namespace TicketTracker.Entities {
    public class Attachment : FullAuditedEntity<long, User> { 
        public string Name { get; set; } 
        public byte[] FileBytes { get; set; }

        public Ticket Ticket { get; set; }
        public long? TicketId { get; set; }

        // IFullAudited
        /*public User CreatorUser { get; set; }
        public long? CreatorUserId { get; set; }
        public DateTime CreationTime { get; set; }

        public User LastModifierUser { get; set; }
        public long? LastModifierUserId { get; set; }
        public DateTime? LastModificationTime { get; set; }

        public User DeleterUser { get; set; }
        public long? DeleterUserId { get; set; }
        public DateTime? DeletionTime { get; set; }

        public bool IsDeleted { get; set; }*/

        // IEntity 
        /*[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public bool IsTransient() => false;*/
    }
}
