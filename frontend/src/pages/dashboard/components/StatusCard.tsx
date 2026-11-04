import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  value: number;
  description: string;
}

function StatusCard({ title, icon: Icon, value, description }: Props) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{title}</p>
          <Icon size={20} className="text-primary" />
        </div>

        <p className="font-display text-3xl font-semibold tracking-tight">
          {value.toLocaleString()}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

export default StatusCard;
