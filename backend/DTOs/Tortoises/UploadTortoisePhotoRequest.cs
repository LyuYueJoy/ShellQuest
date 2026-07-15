using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Tortoises
{
    public class UploadTortoisePhotoRequest
    {
        [Required(ErrorMessage = "A photo is required.")]
        public IFormFile? Photo { get; set; }
    }
}