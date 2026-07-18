using backend.DTOs.Dashboard;

namespace backend.Repositories
{
    public interface IDashboardRepository
    {
        Task<DashboardResponse?> GetDashboardAsync(int ownerId);
    }
}