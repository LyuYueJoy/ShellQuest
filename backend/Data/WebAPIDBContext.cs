using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class WebAPIDBContext : DbContext
    {
        public WebAPIDBContext(DbContextOptions<WebAPIDBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
