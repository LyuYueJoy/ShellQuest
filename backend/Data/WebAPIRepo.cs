using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace backend.Data
{
    public class WebAPIRepo:IWebAPIRepo
    {
        private WebAPIDBContext _context;

        public WebAPIRepo(WebAPIDBContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.UserId == id);
        }

        public User CreateUser(User user)
        {
            EntityEntry<User> entry = _context.Users.Add(user);
            User user1 = entry.Entity;

            _context.SaveChanges();
            return user1;
        }
    }


}
