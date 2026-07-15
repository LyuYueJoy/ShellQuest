using backend.Models;

namespace backend.Repositories
{
    public interface ITortoiseRepository
    {
        Task<List<Tortoise>> GetAllByOwnerIdAsync(int ownerId);

        Task<Tortoise?> GetByIdAsync(int tortoiseId, int ownerId);

        Task<Tortoise> CreateAsync(Tortoise tortoise);

        Task<bool> UpdateAsync(Tortoise tortoise);

        Task<bool> DeleteAsync(Tortoise tortoise);
    }
}