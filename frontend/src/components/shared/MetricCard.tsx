import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  description?: string;
  icon?: LucideIcon;
}

function MetricCard({ title, value, description, icon: Icon }: Props) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{title}</p>
          {Icon && <Icon size={20} className="text-primary" />}
        </div>

        <p className="font-display text-3xl font-semibold tracking-tight">
          {value.toLocaleString()}
        </p>

        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCard;
