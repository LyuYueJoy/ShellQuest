using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Avatar;

public class UpdateAvatarCanvasRequest
{
    [Range(320, 2000)]
    public int CanvasWidth { get; set; }

    [Range(320, 2000)]
    public int CanvasHeight { get; set; }
}