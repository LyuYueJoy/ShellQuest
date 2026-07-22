using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class TortoiseAvatar
{
    [Key]
    public int TortoiseAvatarId { get; set; }

    public int TortoiseId { get; set; }

    [Range(320, 2000)]
    public int CanvasWidth { get; set; } = 800;

    [Range(320, 2000)]
    public int CanvasHeight { get; set; } = 800;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Tortoise Tortoise { get; set; } = null!;

    public ICollection<AvatarEquippedItem> EquippedItems { get; set; } =
        new List<AvatarEquippedItem>();
}