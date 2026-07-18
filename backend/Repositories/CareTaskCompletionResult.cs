using backend.DTOs.CareTasks;

namespace backend.Repositories
{
    public enum CareTaskCompletionStatus
    {
        Success,
        NotFound,
        AlreadyCompleted
    }

    public class CareTaskCompletionResult
    {
        public CareTaskCompletionStatus Status { get; set; }

        public CompleteCareTaskResponse? Response { get; set; }
    }
}