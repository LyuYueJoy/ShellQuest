using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IWebAPIRepo _repo;
        private readonly IConfiguration _configuration;

        public UserController(
            IWebAPIRepo repo,
            IConfiguration configuration)
        {
            _repo = repo;
            _configuration = configuration;
        }

        // POST: api/user/register
        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult<UserResponse> Register(RegisterRequest request)
        {
            string email = request.Email.Trim().ToLower();

            if (_repo.EmailExists(email))
            {
                return Conflict(new
                {
                    message = "This email address is already registered."
                });
            }

            User user = new User
            {
                UserName = request.UserName.Trim(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User"
            };

            User createdUser = _repo.CreateUser(user);

            UserResponse response = ToUserResponse(createdUser);

            return CreatedAtAction(
                nameof(GetUser),
                new { id = createdUser.UserId },
                response
            );
        }

        // POST: api/user/login
        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult Login(LoginRequest request)
        {
            User? user = _repo.GetUserByEmail(request.Email);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(
                    request.Password,
                    user.PasswordHash))
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            string token = CreateJwtToken(user);

            return Ok(new
            {
                token,
                user = ToUserResponse(user)
            });
        }

        // GET: api/user/getUser/1
        [HttpGet("getUser/{id}")]
        public ActionResult<UserResponse> GetUser(int id)
        {
            User? user = _repo.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(ToUserResponse(user));
        }

        private string CreateJwtToken(User user)
        {
            string jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT key is missing.");

            Claim[] claims =
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.UserId.ToString()
                ),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

            SigningCredentials credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserResponse ToUserResponse(User user)
        {
            return new UserResponse
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            };
        }


        // test
        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            string? userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            string? userName = User.FindFirstValue(
                ClaimTypes.Name
            );

            string? email = User.FindFirstValue(
                ClaimTypes.Email
            );

            string? role = User.FindFirstValue(
                ClaimTypes.Role
            );

            return Ok(new
            {
                userId,
                userName,
                email,
                role
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnly()
        {
            return Ok(new
            {
                message = "You are an administrator."
            });
        }


    }
}