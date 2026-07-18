using backend.DTOs.CareTasks;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/care-tasks")]
    public class CareTasksController : ControllerBase
    {
        private readonly ICareTaskRepository
            _careTaskRepository;

        public CareTasksController(
            ICareTaskRepository careTaskRepository
        )
        {
            _careTaskRepository = careTaskRepository;
        }

        // PATCH: api/care-tasks/1/complete
        [HttpPatch("{taskId:int}/complete")]
        public async Task<
            ActionResult<CompleteCareTaskResponse>
        > CompleteTask(int taskId)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId is null)
            {
                return Unauthorized(new
                {
                    message =
                        "The authentication token is invalid."
                });
            }

            CareTaskCompletionResult result =
                await _careTaskRepository
                    .CompleteTaskAsync(
                        taskId,
                        ownerId.Value
                    );

            if (
                result.Status ==
                CareTaskCompletionStatus.NotFound
            )
            {
                return NotFound(new
                {
                    message = "Care task not found."
                });
            }

            if (
                result.Status ==
                CareTaskCompletionStatus
                    .AlreadyCompleted
            )
            {
                return Conflict(new
                {
                    message =
                        "This care task has already been completed."
                });
            }

            if (result.Response is null)
            {
                return StatusCode(
                    StatusCodes
                        .Status500InternalServerError,
                    new
                    {
                        message =
                            "The care task could not be completed."
                    }
                );
            }

            return Ok(result.Response);
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            return int.TryParse(
                userIdValue,
                out int userId
            )
                ? userId
                : null;
        }
    }
}