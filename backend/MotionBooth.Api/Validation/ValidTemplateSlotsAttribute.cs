using System.ComponentModel.DataAnnotations;
using MotionBooth.Api.DTOs.Templates;

namespace MotionBooth.Api.Validation;

public class ValidTemplateSlotsAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not ITemplateRequest request)
            return ValidationResult.Success;

        foreach (var slot in request.Slots)
        {
            if (slot.X < 0 || slot.Y < 0)
            {
                return new ValidationResult("Slot position cannot be negative.");
            }

            if (slot.W <= 0 || slot.H <= 0)
            {
                return new ValidationResult("Slot width and height must be greater than zero.");
            }

            if (slot.X + slot.W > request.Width ||
                slot.Y + slot.H > request.Height)
            {
                return new ValidationResult("Slot must fit within the template dimensions.");
            }
        }

        return ValidationResult.Success;
    }
}