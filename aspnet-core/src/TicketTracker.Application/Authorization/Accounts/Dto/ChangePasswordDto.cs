using System.ComponentModel.DataAnnotations;

namespace TicketTracker.Authorization.Accounts.Dto {
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
