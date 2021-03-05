using System;
using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Localization;
using Abp.Net.Mail;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Abp.Runtime.Validation;
using Abp.UI;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Identity;
using TicketTracker.Authorization.Accounts.Dto;
using TicketTracker.Authorization.Users;

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

namespace TicketTracker.Authorization.Accounts
{
    public class AccountAppService : TicketTrackerAppServiceBase, IAccountAppService
    {
        // from: http://regexlib.com/REDetails.aspx?regexp_id=1923
        public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";

        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly LogInManager _logInManager;
        private readonly UserManager _userManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IAbpSession _abpSession;
        private readonly IObjectMapper _objectMapper;
        private readonly IRepository<User, long> _userRepo;
        private readonly IEmailSender _emailSender;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            LogInManager logInManager,
            UserManager userManager,
            IPasswordHasher<User> passwordHasher,
            IAbpSession abpSession,
            IObjectMapper objectMapper,
            IRepository<User, long> userRepo, 
            IEmailSender emailSender) {

            _userRegistrationManager = userRegistrationManager;
            _logInManager = logInManager;
            _userManager = userManager;
            _passwordHasher = passwordHasher;
            _abpSession = abpSession;
            _objectMapper = objectMapper;
            _userRepo = userRepo;
            _emailSender = emailSender;
        }

        // For everybody
        public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
        {
            var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
            if (tenant == null)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.NotFound);
            }

            if (!tenant.IsActive)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.InActive);
            }

            return new IsTenantAvailableOutput(TenantAvailabilityState.Available, tenant.Id);
        }

        public async Task<RegisterOutput> Register(RegisterInput input)
        {
            var user = await _userRegistrationManager.RegisterAsync(
                input.Name,
                input.Surname,
                input.EmailAddress,
                input.UserName,
                input.Password,
                true // Assumed email address is always confirmed. Change this if you want to implement email confirmation.
            );

            var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

            return new RegisterOutput
            {
                CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin)
            };
        }

        public void ExceptionTest() {
            throw new UserFriendlyException(222, "Message", "Details");
        }
        public void EmailTest() { 
            _emailSender.Send(
                //from: "tickettracker99@gmail.com",
                to: "ciucacosmin109@gmail.com",
                subject: "Email test!",
                body: $"Email test using <b>HTML body</b>",
                isBodyHtml: true
            );
            /*using (MailMessage mail = new MailMessage()) {
                mail.From = new MailAddress("tickettracker99@gmail.com");
                mail.To.Add("ciucacosmin109@gmail.com");
                mail.Subject = "Hello World 222222";
                mail.Body = "<h1>Hello</h1>";
                mail.IsBodyHtml = true;

                using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)) {
                    smtp.Credentials = new NetworkCredential("tickettracker99@gmail.com", "T1MtT@109");
                    smtp.EnableSsl = true;
                    smtp.Send(mail); 
                   }
            }*/
        }  

        // For logged in users
        [AbpAuthorize]
        public async Task<bool> ChangePassword(ChangePasswordDto input) {
            if (_abpSession.UserId == null) {
                throw new UserFriendlyException("Please log in before attemping to change password.");
            }
            long userId = _abpSession.UserId.Value;
            var user = await _userManager.GetUserByIdAsync(userId);
            var loginAsync = await _logInManager.LoginAsync(user.UserName, input.CurrentPassword, shouldLockout: false);
            if (loginAsync.Result != AbpLoginResultType.Success) {
                throw new UserFriendlyException("Your 'Existing Password' did not match the one on record.  Please try again or contact an administrator for assistance in resetting your password.");
            }
            if (!new Regex(AccountAppService.PasswordRegex).IsMatch(input.NewPassword)) {
                throw new UserFriendlyException("Passwords must be at least 8 characters, contain a lowercase, uppercase, and number.");
            }
            user.Password = _passwordHasher.HashPassword(user, input.NewPassword);
            CurrentUnitOfWork.SaveChanges();
            return true;
        }
         
        [AbpAuthorize]
        public async Task ChangeLanguage(ChangeUserLanguageDto input) {
            await SettingManager.ChangeSettingForUserAsync(
                AbpSession.ToUserIdentifier(),
                LocalizationSettingNames.DefaultLanguage,
                input.LanguageName
            );
        }

        // 'C'RUD for 'User' 
        [AbpAuthorize] 
        public async Task<GetAccountOutput> GetAsync() { 
            long id = AbpSession.UserId ?? 0; 
            User user = await _userManager.GetUserByIdAsync(id);
            return _objectMapper.Map<GetAccountOutput>(user); 
        }

        [AbpAuthorize]
        public async Task<UpdateAccountOutput> UpdateAsync(UpdateAccountInput input) {
            long id = AbpSession.UserId ?? 0;
             
            User user = await _userManager.GetUserByIdAsync(id);  
            _objectMapper.Map(input, user); // UpdateInstance(input, user);
            user.SetNormalizedNames();

            CheckErrors(await _userManager.UpdateAsync(user)); 
            return _objectMapper.Map<UpdateAccountOutput>(user);
        }
        private void UpdateInstance(UpdateAccountInput source, User destination) {
            foreach (var prop in source.GetType().GetProperties()) {
                var value = prop.GetValue(source);
                var name = prop.Name;

                if (value != null) {
                    destination.GetType().GetProperty(name).SetValue(destination, value);
                }
            }
        }

        [AbpAuthorize]
        public async Task DeleteAsync() {
            long id = AbpSession.UserId ?? 0;

            User user = await _userManager.GetUserByIdAsync(id);
            CheckErrors(await _userManager.DeleteAsync(user));
        }

        [AbpAuthorize]
        public async Task DeActivate() { 
            long id = AbpSession.UserId ?? 0;

            await _userRepo.UpdateAsync(id, async (entity) => {
                entity.IsActive = false;
            });
        }
    }
}
