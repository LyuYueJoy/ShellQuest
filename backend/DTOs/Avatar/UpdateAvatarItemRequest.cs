using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Avatar;

public class UpdateAvatarItemRequest
{
    [Range(0, 1)]
    public double X { get; set; }

    [Range(0, 1)]
    public double Y { get; set; }

    [Range(0.05, 3)]
    public double Scale { get; set; }

    [Range(-180, 180)]
    public double Rotation { get; set; }

    [Range(0, 100)]
    public int ZIndex { get; set; }
}