using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Localization;
using Abp.Localization.Sources;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TicketTracker.Authorization.Users;
using TicketTracker.BackgroundJobs;
using TicketTracker.BackgroundJobs.Data;
using TicketTracker.Configuration;
using TicketTracker.Entities;
using TicketTracker.EntityFrameworkCore.Repositories;

namespace TicketTracker.Managers {
    public class EmailManager : IDomainService {
        private readonly IRepository<User, long> repoUsers;
        private readonly IRepository<Subscription> repoSubs;
        private readonly TicketRepository repoTickets;
        private readonly CommentRepository repoComments;
        private readonly CommentManager commentManager;
        private readonly ISettingManager settingManager;
        private readonly IBackgroundJobManager jobManager;
        private readonly IWebHostEnvironment env;
        private readonly ILocalizationSource l;

        public EmailManager(
            IRepository<User, long> repoUsers,
            IRepository<Subscription> repoSubs,
            TicketRepository repoTickets,
            CommentRepository repoComments,
            CommentManager commentManager,
            ISettingManager settingManager,
            ILocalizationManager localizationManager,
            IBackgroundJobManager jobManager,
            IWebHostEnvironment env
        ) {
            this.repoUsers = repoUsers;
            this.repoSubs = repoSubs;
            this.repoTickets = repoTickets;
            this.repoComments = repoComments;
            this.commentManager = commentManager;
            this.settingManager = settingManager;
            this.jobManager = jobManager;
            this.env = env; 

            this.l = localizationManager.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public string getTemplate(string htmlFileName) {
            string template = env.WebRootPath
                + Path.DirectorySeparatorChar.ToString()
                + "templates"
                + Path.DirectorySeparatorChar.ToString()
                + "email"
                + Path.DirectorySeparatorChar.ToString()
                + htmlFileName;

            return System.IO.File.ReadAllText(template);
        }
        public string localizeTemplate(string template, string language) {
            var result = template;

            var matches = Regex.Matches(template, @"\[[ a-zA-Z0-9\{\}]+\]");
            foreach(Match match in matches) { 
                if (match.Success) {
                    var text = match.Value;

                    var localizer = text.Trim('[', ' ', ']'); 
                    var localizedText = l.GetString(localizer, CultureInfo.CreateSpecificCulture(language));

                    result = result.Replace(text, localizedText);
                }
            }
            return result;
        }

        public void SendTicketUpdate(string oldTitle, Ticket newT) {
            List<Subscription> subs = repoSubs
                .GetAllIncluding(x => x.User)
                .Where(x => x.TicketId == newT.Id)
                .ToList();

            string template = getTemplate("ticketUpdate.html");

            foreach (Subscription sub in subs) {
                User targetUser = sub.User;
                string language = settingManager.GetSettingValueForUser(
                    LocalizationSettingNames.DefaultLanguage,
                    targetUser.ToUserIdentifier()
                );

                string body = string.Format(template,
                    oldTitle,
                    newT.LastModifierUser.FullName,

                    newT.Id,
                    newT.Title,
                    newT.Description,
                    l.GetString(newT.Priority.ToString(), language),
                    l.GetString(newT.Type.ToString(), language),
                    l.GetString(newT.Status.Name, language),
                    l.GetString(newT.Activity != null ? newT.Activity.Name : "NoActivity", language),

                    settingManager.GetSettingValue(AppSettingNames.ClientRootAddress)
                    + "ticket/" + newT.Id
                );

                var email = new SendEmailArgs {
                    To = targetUser.EmailAddress,
                    Subject = l.GetString("ATicketWasUpdated", language),
                    Body = localizeTemplate(body, language)
                };

                jobManager.Enqueue<SendEmailJob, SendEmailArgs>(email);
            }
        }
        public void SendNewComment(Comment comment) {
            Ticket ticket = commentManager.GetTicket(comment.Id);
            List<Subscription> subs = repoSubs
                .GetAllIncluding(x => x.User)
                .Where(x => x.TicketId == ticket.Id)
                .ToList();

            string template = getTemplate("newComment.html");

            foreach (Subscription sub in subs) {
                User targetUser = sub.User;
                string language = settingManager.GetSettingValueForUser(
                    LocalizationSettingNames.DefaultLanguage,
                    targetUser.ToUserIdentifier()
                );

                string body = string.Format(template,
                    comment.CreatorUser.FullName,

                    ticket.Title,
                    ticket.Id,
                    ticket.Description,
                    l.GetString(ticket.Priority.ToString(), language),
                    l.GetString(ticket.Type.ToString(), language),
                    l.GetString(ticket.Status.Name, language),
                    l.GetString(ticket.Activity != null ? ticket.Activity.Name : "NoActivity", language),

                    comment.CreatorUser.FullName,
                    comment.Content,

                    settingManager.GetSettingValue(AppSettingNames.ClientRootAddress)
                    + "ticket/" + ticket.Id
                );

                var email = new SendEmailArgs {
                    To = targetUser.EmailAddress,
                    Subject = l.GetString("ANewCommentWasAdded", language),
                    Body = localizeTemplate(body, language)
                };

                jobManager.Enqueue<SendEmailJob, SendEmailArgs>(email);
            }
        }
    }
}
