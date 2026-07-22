using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Avatar;

public class EquipAvatarItemRequest
{
    [Range(1, int.MaxValue)]
    public int ShopItemId { get; set; }
}