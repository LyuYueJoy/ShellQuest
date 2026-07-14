using backend.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace backend.Data
{
    public class WebAPIRepo : IWebAPIRepo
    {
        private readonly WebAPIDBContext _context;

        public WebAPIRepo(WebAPIDBContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User? GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(user => user.UserId == id);
        }

        public User? GetUserByEmail(string email)
        {
            string normalizedEmail = email.Trim().ToLower();

            return _context.Users.FirstOrDefault(
                user => user.Email.ToLower() == normalizedEmail
            );
        }

        public bool EmailExists(string email)
        {
            string normalizedEmail = email.Trim().ToLower();

            return _context.Users.Any(
                user => user.Email.ToLower() == normalizedEmail
            );
        }

        public User CreateUser(User user)
        {
            EntityEntry<User> entry = _context.Users.Add(user);
            _context.SaveChanges();

            return entry.Entity;
        }
    }
}