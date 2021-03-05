using System.ComponentModel.DataAnnotations;

namespace TicketTracker.Authorization.Accounts.Dto {
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}