using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User> CreateUserAsync(User user);
        Task<bool> UserExistsAsync(string username);
        Task<bool> PasswordIsCorrectAsync(string username, string password);
        Task DeleteUserAsync(string username, string password);
        Task UpdatePasswordAsync(string username, string oldPassword, string newPassword);
        Task UpdateUsernameAsync(string username, string newUsername);
        Task<bool> IsAdmin(string username);
        Task UpdateAvatar(string username, string avatar);


    }
}
