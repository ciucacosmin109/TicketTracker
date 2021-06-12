using System.Linq;
using Microsoft.EntityFrameworkCore;
using Abp.Configuration;
using Abp.Localization;
using Abp.MultiTenancy;
using Abp.Net.Mail;
using TicketTracker.Configuration;
using TicketTracker.Web;
using Microsoft.Extensions.Configuration;
using static System.Net.Mime.MediaTypeNames;
using System.IO;
using System.Reflection;
using System;

namespace TicketTracker.EntityFrameworkCore.Seed.Host {
    public class DefaultSettingsCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly IConfiguration configuration;

        public DefaultSettingsCreator(
            TicketTrackerDbContext context,
            IConfiguration configuration
        ) {
            this._context = context;
            this.configuration = configuration;
        }

        public void Create() {
            int? tenantId = null; 

            if (TicketTrackerConsts.MultiTenancyEnabled == false) {
                tenantId = MultiTenancyConsts.DefaultTenantId;
            }

            // Get values  
            //var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());
            string DefaultFromAddress = configuration.GetValue<string>("DbSeedValues:Smtp:DefaultFromAddress");
            string DefaultFromDisplayName = configuration.GetValue<string>("DbSeedValues:Smtp:DefaultFromDisplayName");
            string Host = configuration.GetValue<string>("DbSeedValues:Smtp:Host");
            string Port = configuration.GetValue<string>("DbSeedValues:Smtp:Port");
            string EnableSsl = configuration.GetValue<string>("DbSeedValues:Smtp:EnableSsl");
            string UserName = configuration.GetValue<string>("DbSeedValues:Smtp:UserName");
            string Password = configuration.GetValue<string>("DbSeedValues:Smtp:Password");
            string UseDefaultCredentials = configuration.GetValue<string>("DbSeedValues:Smtp:UseDefaultCredentials");
            string DefaultLanguage = configuration.GetValue<string>("DbSeedValues:DefaultLanguage", "en");
            string ClientRootAddress = configuration.GetValue<string>("App:ClientRootAddress");
            if(ClientRootAddress != null && ClientRootAddress.Length > 0 && !ClientRootAddress.EndsWith('/')) {
                ClientRootAddress += '/';
            }

            // Email
            AddSettingIfNotExists(EmailSettingNames.DefaultFromAddress, DefaultFromAddress, tenantId);
            AddSettingIfNotExists(EmailSettingNames.DefaultFromDisplayName, DefaultFromDisplayName, tenantId);  
            AddSettingIfNotExists(EmailSettingNames.Smtp.Host, Host, tenantId);
            AddSettingIfNotExists(EmailSettingNames.Smtp.Port, Port, tenantId);
            AddSettingIfNotExists(EmailSettingNames.Smtp.EnableSsl, EnableSsl, tenantId);
            AddSettingIfNotExists(EmailSettingNames.Smtp.UserName, UserName, tenantId);
            AddSettingIfNotExists(EmailSettingNames.Smtp.Password, Password, tenantId);
            AddSettingIfNotExists(EmailSettingNames.Smtp.UseDefaultCredentials, UseDefaultCredentials, tenantId);

            // Others
            AddSettingIfNotExists(LocalizationSettingNames.DefaultLanguage, DefaultLanguage, tenantId);
            AddSettingIfNotExists(AppSettingNames.ClientRootAddress, ClientRootAddress, tenantId);
        }

        private void AddSettingIfNotExists(string name, string value, int? tenantId = null) {
            if (_context.Settings.IgnoreQueryFilters().Any(s => s.Name == name && s.TenantId == tenantId && s.UserId == null)) {
                return;
            }

            _context.Settings.Add(new Setting(tenantId, null, name, value));
            _context.SaveChanges();
        }
    }
}
