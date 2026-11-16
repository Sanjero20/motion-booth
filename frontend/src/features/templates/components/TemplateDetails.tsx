import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  name: string;
  setName: (name: string) => void;
}

function TemplateDetails({ name, setName }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Template Details</CardTitle>
        <CardDescription>
          Give your template a name and add the basic details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            placeholder="e.g. Sarah & John's Wedding"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TemplateDetails;
