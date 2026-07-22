namespace backend.DTOs.Avatar;

public class AvatarEquippedItemResponse
{
    public int AvatarEquippedItemId { get; set; }

    public int ShopItemId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string AssetKey { get; set; } = string.Empty;

    public string AssetUrl { get; set; } = string.Empty;

    public string AssetType { get; set; } = string.Empty;

    public double X { get; set; }

    public double Y { get; set; }

    public double Scale { get; set; }

    public double Rotation { get; set; }

    public int ZIndex { get; set; }
}