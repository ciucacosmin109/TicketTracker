using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace TicketTracker.Localization
{
    public static class TicketTrackerLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(TicketTrackerConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(TicketTrackerLocalizationConfigurer).GetAssembly(),
                        "TicketTracker.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
