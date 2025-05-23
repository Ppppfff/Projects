using Application.DTOs.User;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByUsernameAsync(string username);
        Task<UserDto> CreateUserAsync(CreateUserDto dto);
        Task<bool> UserExistsAsync(string username);
        Task<bool> PasswordIsCorrectAsync(string username, string password);
        Task DeleteUserAsync(string username, string password);
        Task UpdatePasswordAsync(string username, string oldPassword, string newPassword);
        Task UpdateUsernameAsync(string username, string newUsername);
        Task<bool> IsAdmin(string username);
        Task UpdateAvatar(string username, string avatar);


    }
}
