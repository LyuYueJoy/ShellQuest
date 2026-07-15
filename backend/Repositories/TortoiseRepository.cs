using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class TortoiseRepository : ITortoiseRepository
    {
        private readonly WebAPIDBContext _context;

        public TortoiseRepository(WebAPIDBContext context)
        {
            _context = context;
        }

        public async Task<List<Tortoise>> GetAllByOwnerIdAsync(int ownerId)
        {
            return await _context.Tortoises
                .AsNoTracking()
                .Where(tortoise => tortoise.OwnerId == ownerId)
                .OrderByDescending(tortoise => tortoise.CreatedAt)
                .ToListAsync();
        }

        public async Task<Tortoise?> GetByIdAsync(
            int tortoiseId,
            int ownerId
        )
        {
            return await _context.Tortoises
                .FirstOrDefaultAsync(tortoise =>
                    tortoise.TortoiseId == tortoiseId &&
                    tortoise.OwnerId == ownerId
                );
        }

        public async Task<Tortoise> CreateAsync(Tortoise tortoise)
        {
            _context.Tortoises.Add(tortoise);
            await _context.SaveChangesAsync();

            return tortoise;
        }

        public async Task<bool> UpdateAsync(Tortoise tortoise)
        {
            _context.Tortoises.Update(tortoise);

            int changedRows = await _context.SaveChangesAsync();

            return changedRows > 0;
        }

        public async Task<bool> DeleteAsync(Tortoise tortoise)
        {
            _context.Tortoises.Remove(tortoise);

            int changedRows = await _context.SaveChangesAsync();

            return changedRows > 0;
        }
    }
}