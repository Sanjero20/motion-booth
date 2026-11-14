import PhotoBooth from "@/features/booth/components/PhotoBooth";
import type { Template } from "../types/template";

interface Props {
  template: Template;
}

function CustomTemplateViewer({ template }: Props) {
  return <PhotoBooth template={template} />;
}

export default CustomTemplateViewer;
