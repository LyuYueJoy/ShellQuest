using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IWebAPIRepo _repo;

        public UserController(IWebAPIRepo repo)
        {
            _repo = repo;
        }


        // GET: api/user
        [HttpGet("getUsers")]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            var users = _repo.GetAllUsers();

            return Ok(users);
        }


        // GET: api/user/1
        [HttpGet("getUser/{id}")]
        public ActionResult<User> GetUser(int id)
        {
            var user = _repo.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


        // POST: api/user
        [HttpPost("addUser")]
        public ActionResult<User> CreateUser(User user)
        {
            var createdUser = _repo.CreateUser(user);

            return CreatedAtAction(
                nameof(GetUser),
                new { id = createdUser.UserId },
                createdUser
            );
        }
    }
}