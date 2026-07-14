using backend.Models;
namespace backend.Data
{
    public interface IWebAPIRepo
    {
        IEnumerable<User> GetAllUsers();
        User? GetUserById(int id);
        User? GetUserByEmail(string email);
        bool EmailExists(string email);
        User CreateUser(User user);
    }
}
