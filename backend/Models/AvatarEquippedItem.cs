using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class AvatarEquippedItem
{
    [Key]
    public int AvatarEquippedItemId { get; set; }

    public int TortoiseAvatarId { get; set; }

    public int ShopItemId { get; set; }

    [Range(0, 1)]
    public double X { get; set; } = 0.5;

    [Range(0, 1)]
    public double Y { get; set; } = 0.5;

    [Range(0.05, 3)]
    public double Scale { get; set; } = 1;

    [Range(-180, 180)]
    public double Rotation { get; set; }

    [Range(0, 100)]
    public int ZIndex { get; set; } = 1;

    public TortoiseAvatar TortoiseAvatar { get; set; } = null!;

    public ShopItem ShopItem { get; set; } = null!;
}