using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using TicketTracker.Roles.Dto;
using TicketTracker.Users.Dto;

namespace TicketTracker.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task DeActivate(EntityDto<long> user);
        Task Activate(EntityDto<long> user);
        Task<ListResultDto<RoleDto>> GetRoles();
    }
}
