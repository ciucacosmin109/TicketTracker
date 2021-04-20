using System.Text.RegularExpressions;
using Abp.Extensions;

namespace TicketTracker.Validation {
    public static class ValidationHelper {
        public const string EmailRegex = @"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";
        // from: http://regexlib.com/REDetails.aspx?regexp_id=1923
        public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";

        public static bool CheckRegex(string value, string regexValue) {
            if (value.IsNullOrEmpty()) {
                return false;
            }

            var regex = new Regex(regexValue);
            return regex.IsMatch(value);
        }

        public static bool IsEmail(string value) {
            return CheckRegex(value, EmailRegex);
        }

        public static bool IsPassword(string value) {
            return CheckRegex(value, PasswordRegex);
        }
    }
}
