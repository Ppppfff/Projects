using static System.Net.WebRequestMethods;

namespace Application.DTOs.User
{
    public class CreateUserDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public bool isAdmin { get; set; }
        public string Avatar { get; set; }

    }
}
