using System.Text.Json;
using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Models;

namespace MotionBooth.Api.Helpers;

public static class TemplateRequestHelper
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static bool TryDeserialize(
        SaveTemplateRequest request,
        out Layout? layout,
        out List<Slot>? slots
    )
    {
        layout = null;
        slots = null;

        try
        {
            layout = JsonSerializer.Deserialize<Layout>(request.Layout, JsonOptions);

            slots = JsonSerializer.Deserialize<List<Slot>>(request.Slots, JsonOptions);

            return layout is not null && slots is { Count: > 0 };
        }
        catch (JsonException)
        {
            return false;
        }
    }
}
