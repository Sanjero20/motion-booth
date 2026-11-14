import { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import DeleteConfirmationDialog from "./dialog/DeleteConfirmationDialog";

interface Props {
  resourceName: string;
  description: string;
  isDeleting: boolean;
  onConfirm: () => void;
}

function DangerZone({
  resourceName,
  description,
  isDeleting,
  onConfirm,
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <section className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Danger Zone</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash />
          Delete {resourceName}
        </Button>
      </section>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Event?"
        description={`Are you sure you want to delete this ${resourceName}? This action cannot be undone.`}
        confirmLabel="Delete"
        isDeleting={isDeleting}
        onConfirm={onConfirm}
      />
    </>
  );
}

export default DangerZone;
