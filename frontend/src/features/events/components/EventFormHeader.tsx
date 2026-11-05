import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";

interface EventFormHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

function EventFormHeader({
  isEditing,
  isSubmitting,
  onCancel,
}: EventFormHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <PageHeading
        eyebrow={`Workspace / Events / ${isEditing ? "Edit" : "New"}`}
        title={isEditing ? "Edit Event" : "Create Event"}
        description="Set up your event and customize its photo experience."
      />

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" form="event-form" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Event"}
        </Button>
      </div>
    </div>
  );
}

export default EventFormHeader;
