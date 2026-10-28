using System.ComponentModel.DataAnnotations;

namespace MotionBooth.Api.Validation;

public class NotWhitespaceAttribute : ValidationAttribute
{
    public NotWhitespaceAttribute() : base("The field must not contain only whitepsace.")
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        return value is string text && !string.IsNullOrWhiteSpace(text);
    }
}