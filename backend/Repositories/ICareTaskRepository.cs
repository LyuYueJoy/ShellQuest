namespace backend.Repositories
{
    public interface ICareTaskRepository
    {
        Task<CareTaskCompletionResult> CompleteTaskAsync(
            int taskId,
            int ownerId
        );
    }
}