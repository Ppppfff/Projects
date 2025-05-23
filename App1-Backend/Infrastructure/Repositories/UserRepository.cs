using Application;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Cart)
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var cart = new Cart { UserId = user.Id, User = user };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            user.Cart = cart;
            return user;
        }

        public async Task<bool> UserExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<bool> PasswordIsCorrectAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if(user == null) return false;

            return PasswordHelper.VerifyPassword(user.Password, password);
        }

        public async Task DeleteUserAsync(string username, string password)
        {
            var user = await GetByUsernameAsync(username);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePasswordAsync(string username, string oldPassword, string newPassword)
        {
            var user = await GetByUsernameAsync(username);
            user.Password = PasswordHelper.HashPassword(newPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUsernameAsync(string username, string newUsername)
        {
            var user = await GetByUsernameAsync(username);
            user.Username = newUsername;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsAdmin(string username)
        {
            var user = await _context.Users
                .Where(u => u.Username == username)
                .Select(u => u.IsAdmin)
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task UpdateAvatar(string username, string avatar)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                throw new Exception("User not found");

            user.avatar = avatar;
            await _context.SaveChangesAsync();
        }
    }
}
