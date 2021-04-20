using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Authorization.Accounts.Dto {
    public class SearchAccountsInput : PagedAndSortedResultRequestDto, IValidatableObject {
        [Required]
        public string Keyword { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            if(String.IsNullOrEmpty(Keyword) || Keyword.Replace(" ", "").Length < 3) {
                yield return new ValidationResult("The Keyword must have at least 3 characters");
            }
        }
    }
}
