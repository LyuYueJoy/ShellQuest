namespace backend.DTOs.Avatar;

public class AvatarResponse
{
    public int TortoiseAvatarId { get; set; }

    public int TortoiseId { get; set; }

    public string TortoiseName { get; set; } = string.Empty;

    public string? TortoisePhotoUrl { get; set; }

    public int CanvasWidth { get; set; }

    public int CanvasHeight { get; set; }

    public DateTime UpdatedAt { get; set; }

    public List<AvatarEquippedItemResponse> EquippedItems { get; set; } = [];
}