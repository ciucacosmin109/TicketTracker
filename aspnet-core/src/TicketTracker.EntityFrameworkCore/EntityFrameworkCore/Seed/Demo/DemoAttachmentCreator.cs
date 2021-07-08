using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoAttachmentCreator { 
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoAttachmentCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        public List<File> GetAttachments1(long creatorUserId) {
            return new List<File> {
                new File {
                    Name = "Poza 1.jpeg",
                    FileBytes = new byte[] {2,23,4,32,4,1,2,13,23,1,3,3},
                    CreatorUserId = creatorUserId
                },
                new File {
                    Name = "Poza 2.jpeg",
                    FileBytes = new byte[] {2,23,4,32,4,1,2,13,23,1,3,3},
                    CreatorUserId = creatorUserId
                },
                new File {
                    Name = "Video.mp4",
                    FileBytes = new byte[] {2,23,4,32,4,1,2,13,23,1,3,3},
                    CreatorUserId = creatorUserId
                },
            };
        }
        public List<File> GetAttachments2(long creatorUserId) {
            return new List<File> { 
                new File {
                    Name = "Video.mp4",
                    FileBytes = new byte[] {2,23,4,32,4,1,2,13,23,1,3,3},
                    CreatorUserId = creatorUserId
                },
            };
        }
    }
}
