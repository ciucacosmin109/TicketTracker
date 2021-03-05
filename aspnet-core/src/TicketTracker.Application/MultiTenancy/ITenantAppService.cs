using Abp.Application.Services;
using TicketTracker.MultiTenancy.Dto;

namespace TicketTracker.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

