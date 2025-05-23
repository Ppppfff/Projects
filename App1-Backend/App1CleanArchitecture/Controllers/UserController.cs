using Application.DTOs.User;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;

namespace App1CleanArchitecture.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _service;
        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LogInDto dto)
        {
            if (!await _service.UserExistsAsync(dto.Username))
                return NotFound("User not found.");

            if (!await _service.PasswordIsCorrectAsync(dto.Username, dto.Password))
                return Unauthorized("Invalid password.");

            return Ok("Login successful.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]CreateUserDto CreateUserDto)
        {
            if (CreateUserDto.Password == null) return BadRequest("Enter a password");
            if (await _service.UserExistsAsync(CreateUserDto.Username)) return BadRequest("Username already exists.");

            var user = await _service.CreateUserAsync(CreateUserDto);
            return Ok(user);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            var user = await _service.GetByUsernameAsync(username);
            if (user == null)
                return NotFound("User not found.");

            return Ok(user);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser([FromBody]DeleteUserDto dto)
        {
            var success = true;//await _service.PasswordIsCorrectAsync(dto.Username, dto.Password);
            if (!success) return Unauthorized("Incorrect password");
            await _service.DeleteUserAsync(dto.Username, dto.Password);
            return Ok("User deleted successfully.");
        }

        [HttpPut("UpdatePassword")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdateUserPasswordDto request)
        {
            var isCorrect = await _service.PasswordIsCorrectAsync(request.Username, request.Password);
            if (!isCorrect)
                return Unauthorized("Incorrect current password.");

            await _service.UpdatePasswordAsync(request.Username, request.Password, request.changed);
            return Ok("Password updated successfully.");
        }

        [HttpPut("UpdateUsername")]
        public async Task<IActionResult> UpdateUsername([FromBody] UpdataUsernameDto request)
        {
            var userExists = await _service.UserExistsAsync(request.NewUsername);
            if (userExists)
                return BadRequest("The new username is already taken.");

            await _service.UpdateUsernameAsync(request.Username, request.NewUsername);
            return Ok("Username updated successfully.");
        }

        [HttpGet("IsAdmin/{username}")]
        public async Task<IActionResult> IsAdmin(string username)
        {
            var isAdmin = await _service.IsAdmin(username);
            return Ok(isAdmin);
        }

        [HttpPut("UpdateAvatar")]
        public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarDto request)
        {
            try
            {
                await _service.UpdateAvatar(request.Username, request.Avatar);
                return Ok("Avatar updated successfully.");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
