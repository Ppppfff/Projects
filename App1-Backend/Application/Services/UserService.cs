using Application.DTOs.User;
using Application.Interfaces;
using Core.Entities;
using Core.Interfaces;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }
        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Password = PasswordHelper.HashPassword(dto.Password),
                IsAdmin = dto.isAdmin,
                avatar = dto.Avatar,
            };

            var createdUser = await _repo.CreateUserAsync(user);

            return new UserDto
            {
                Id = createdUser.Id,
                Username = createdUser.Username,
                isAdmin = createdUser.IsAdmin,
                Avatar = createdUser.avatar,
            };
        }

        public async Task<UserDto?> GetByUsernameAsync(string username)
        {
            var user = await _repo.GetByUsernameAsync(username);
            if (user == null) return null;

            return new UserDto
            {
                Username = user.Username,
                Id = user.Id,
                Avatar = user.avatar,
                isAdmin = user.IsAdmin,
                CartId = user.Cart.Id,
            };
        }

        public async Task<bool> PasswordIsCorrectAsync(string username, string password)
        {
            return await _repo.PasswordIsCorrectAsync(username, password);
        }

        public async Task<bool> UserExistsAsync(string username)
        {
            return await _repo.UserExistsAsync(username);
        }

        public async Task DeleteUserAsync(string username, string password)
        {
            await _repo.DeleteUserAsync(username, password);
        }

        public async Task UpdatePasswordAsync(string username, string oldPassword, string newPassword)
        {
            await _repo.UpdatePasswordAsync(username, oldPassword, newPassword);
        }

        public async Task UpdateUsernameAsync(string username, string newUsername)
        {
            await _repo.UpdateUsernameAsync(username, newUsername);
        }

        public async Task<bool> IsAdmin(string username)
        {
            return await _repo.IsAdmin(username);
        }

        public async Task UpdateAvatar(string username, string avatar)
        {
            await _repo.UpdateAvatar(username, avatar);
        }
    }
}
