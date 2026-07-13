using backend.Models;
namespace backend.Data
{
    public interface IWebAPIRepo
    {
        IEnumerable<User> GetAllUsers();
        User GetUserById(int id);
        User CreateUser(User user);
    }
}
