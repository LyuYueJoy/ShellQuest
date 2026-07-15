using backend.DTOs.Tortoises;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/tortoises")]
    public class TortoisesController : ControllerBase
    {
        private const long MaximumPhotoSize = 5 * 1024 * 1024;

        private static readonly HashSet<string> AllowedExtensions =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ".png",
                ".jpg",
                ".jpeg",
                ".webp"
            };

        private static readonly HashSet<string> AllowedContentTypes =
            new(StringComparer.OrdinalIgnoreCase)
            {
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/webp"
            };

        private readonly ITortoiseRepository _tortoiseRepository;
        private readonly IWebHostEnvironment _environment;

        public TortoisesController(
            ITortoiseRepository tortoiseRepository,
            IWebHostEnvironment environment
        )
        {
            _tortoiseRepository = tortoiseRepository;
            _environment = environment;
        }

        // GET: api/tortoises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TortoiseResponse>>>
            GetTortoises()
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            List<Tortoise> tortoises =
                await _tortoiseRepository
                    .GetAllByOwnerIdAsync(ownerId.Value);

            List<TortoiseResponse> response = tortoises
                .Select(ToTortoiseResponse)
                .ToList();

            return Ok(response);
        }

        // GET: api/tortoises/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TortoiseResponse>>
            GetTortoise(int id)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            return Ok(ToTortoiseResponse(tortoise));
        }

        // POST: api/tortoises
        [HttpPost]
        public async Task<ActionResult<TortoiseResponse>>
            CreateTortoise(CreateTortoiseRequest request)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            string name = request.Name.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new
                {
                    message = "Tortoise name is required."
                });
            }

            Tortoise tortoise = new Tortoise
            {
                OwnerId = ownerId.Value,
                Name = name,
                AgeMonths = request.AgeMonths,
                WeightGrams = request.WeightGrams,
                PhotoUrl = null,
                Notes = NormalizeOptionalText(request.Notes),
                CreatedAt = DateTime.UtcNow
            };

            Tortoise createdTortoise =
                await _tortoiseRepository.CreateAsync(tortoise);

            TortoiseResponse response =
                ToTortoiseResponse(createdTortoise);

            return CreatedAtAction(
                nameof(GetTortoise),
                new { id = createdTortoise.TortoiseId },
                response
            );
        }

        // PUT: api/tortoises/1
        [HttpPut("{id:int}")]
        public async Task<ActionResult<TortoiseResponse>>
            UpdateTortoise(
                int id,
                UpdateTortoiseRequest request
            )
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            string name = request.Name.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new
                {
                    message = "Tortoise name is required."
                });
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            tortoise.Name = name;
            tortoise.AgeMonths = request.AgeMonths;
            tortoise.WeightGrams = request.WeightGrams;
            tortoise.Notes =
                NormalizeOptionalText(request.Notes);

            await _tortoiseRepository.UpdateAsync(tortoise);

            return Ok(ToTortoiseResponse(tortoise));
        }

        // DELETE: api/tortoises/1
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTortoise(int id)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            string? photoUrl = tortoise.PhotoUrl;

            await _tortoiseRepository.DeleteAsync(tortoise);

            DeleteStoredPhoto(photoUrl);

            return NoContent();
        }

        // POST: api/tortoises/1/photo
        [HttpPost("{id:int}/photo")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(MaximumPhotoSize)]
        public async Task<ActionResult<TortoiseResponse>>
            UploadPhoto(
                int id,
                [FromForm] UploadTortoisePhotoRequest request
            )
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            IFormFile? photo = request.Photo;

            if (photo == null || photo.Length == 0)
            {
                return BadRequest(new
                {
                    message = "Please select a photo."
                });
            }

            if (photo.Length > MaximumPhotoSize)
            {
                return BadRequest(new
                {
                    message = "The photo cannot exceed 5 MB."
                });
            }

            string extension = Path.GetExtension(
                photo.FileName
            );

            if (!AllowedExtensions.Contains(extension))
            {
                return BadRequest(new
                {
                    message =
                        "Only PNG, JPEG and WebP photos are allowed."
                });
            }

            if (!AllowedContentTypes.Contains(photo.ContentType))
            {
                return BadRequest(new
                {
                    message =
                        "The uploaded file is not a supported image."
                });
            }

            string webRootPath =
                _environment.WebRootPath
                ?? Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot"
                );

            string uploadDirectory = Path.Combine(
                webRootPath,
                "uploads",
                "tortoises",
                ownerId.Value.ToString()
            );

            Directory.CreateDirectory(uploadDirectory);

            string fileName =
                $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

            string filePath = Path.Combine(
                uploadDirectory,
                fileName
            );

            try
            {
                await using FileStream stream =
                    new FileStream(
                        filePath,
                        FileMode.CreateNew
                    );

                await photo.CopyToAsync(stream);
            }
            catch (IOException)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "The photo could not be saved."
                    }
                );
            }

            string newPhotoUrl =
                $"/uploads/tortoises/{ownerId.Value}/{fileName}";

            string? previousPhotoUrl = tortoise.PhotoUrl;

            tortoise.PhotoUrl = newPhotoUrl;

            try
            {
                await _tortoiseRepository.UpdateAsync(tortoise);
            }
            catch
            {
                DeleteStoredPhoto(newPhotoUrl);
                throw;
            }

            DeleteStoredPhoto(previousPhotoUrl);

            return Ok(ToTortoiseResponse(tortoise));
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (!int.TryParse(userIdValue, out int userId))
            {
                return null;
            }

            return userId;
        }

        private UnauthorizedObjectResult InvalidTokenResponse()
        {
            return Unauthorized(new
            {
                message =
                    "The user ID is missing from the access token."
            });
        }

        private static string? NormalizeOptionalText(
            string? value
        )
        {
            return string.IsNullOrWhiteSpace(value)
                ? null
                : value.Trim();
        }

        private void DeleteStoredPhoto(string? photoUrl)
        {
            if (string.IsNullOrWhiteSpace(photoUrl))
            {
                return;
            }

            const string expectedPrefix =
                "/uploads/tortoises/";

            if (!photoUrl.StartsWith(
                expectedPrefix,
                StringComparison.OrdinalIgnoreCase
            ))
            {
                return;
            }

            string webRootPath =
                _environment.WebRootPath
                ?? Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot"
                );

            string relativePath = photoUrl
                .TrimStart('/')
                .Replace('/', Path.DirectorySeparatorChar);

            string fullPath = Path.GetFullPath(
                Path.Combine(webRootPath, relativePath)
            );

            string allowedRoot = Path.GetFullPath(
                Path.Combine(
                    webRootPath,
                    "uploads",
                    "tortoises"
                )
            );

            if (!fullPath.StartsWith(
                allowedRoot,
                StringComparison.OrdinalIgnoreCase
            ))
            {
                return;
            }

            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }
        }

        private static TortoiseResponse ToTortoiseResponse(
            Tortoise tortoise
        )
        {
            return new TortoiseResponse
            {
                TortoiseId = tortoise.TortoiseId,
                Name = tortoise.Name,
                AgeMonths = tortoise.AgeMonths,
                WeightGrams = tortoise.WeightGrams,
                PhotoUrl = tortoise.PhotoUrl,
                Notes = tortoise.Notes,
                CreatedAt = tortoise.CreatedAt
            };
        }
    }
}