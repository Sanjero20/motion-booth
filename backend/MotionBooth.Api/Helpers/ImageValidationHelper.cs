namespace MotionBooth.Api.Helpers;

public static class ImageValidationHelper
{
    private const long MaxFileSize = 5 * 1024 * 1024;

    private static readonly Dictionary<string, string> AllowedContentTypes = new()
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp",
    };

    public static bool TryValidate(IFormFile file, out string? extension, out string? errorMessage)
    {
        extension = null;
        errorMessage = null;

        if (file.Length == 0 || file.Length > MaxFileSize)
        {
            errorMessage = "The image must be between 1 byte and 5 MB.";
            return false;
        }

        if (!AllowedContentTypes.TryGetValue(file.ContentType, out extension))
        {
            errorMessage = "Only JPEG, PNG, and WebP images are supported.";
            return false;
        }

        return true;
    }
}
