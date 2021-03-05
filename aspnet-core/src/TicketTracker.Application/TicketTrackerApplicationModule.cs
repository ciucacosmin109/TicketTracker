using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using TicketTracker.Authorization;

namespace TicketTracker
{
    [DependsOn(
        typeof(TicketTrackerCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class TicketTrackerApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<TicketTrackerAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(TicketTrackerApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
