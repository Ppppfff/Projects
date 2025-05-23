using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public bool isAdmin { get; set; }
        public string Avatar {  get; set; }
        public int CartId { get; set; }

    }
}
