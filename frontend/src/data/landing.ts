import {
  Film,
  Download,
  QrCode,
  Smartphone,
  Heart,
  Cake,
  Building2,
  PartyPopper,
  GraduationCap,
  Music,
  Camera,
  LayoutTemplate,
} from "lucide-react";

export const STATS = [
  { value: "5s", label: "of build-up kept per shot" },
  { value: "8s", label: "social-ready video" },
  { value: "0", label: "apps to install" },
];

// How It Works section
export const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    body: "Classic strip, 2 × 2 grid or a 9:16 story — chosen before the first flash.",
  },
  {
    icon: Camera,
    title: "Strike four poses",
    body: "A 3-2-1 countdown for each shot. The booth quietly keeps the 5 seconds before every click.",
  },
  {
    icon: QrCode,
    title: "Take it home",
    body: "Scan the QR or download on the spot — an 8-second motion video and a print-ready photo.",
  },
];

// Sharing Section
export const SHARING_FEATURES = [
  {
    icon: Film,
    title: "8-second motion video",
    body: "5 seconds of build-up, then a 3-second hold on the final shot. Under 10s — made for Reels, TikTok and Stories.",
  },
  {
    icon: Download,
    title: "Print-ready photo",
    body: "A crisp, high-resolution PNG of the finished template, ready for the printer or the fridge.",
  },
  {
    icon: QrCode,
    title: "Scan to save",
    body: "Every session gets its own QR code and link. Guests grab their moments without typing a thing.",
  },
  {
    icon: Smartphone,
    title: "No app needed",
    body: "Opens right in the phone browser. The link stays active for 30 days.",
  },
];

export const EVENTS = [
  { icon: Heart, label: "Weddings" },
  { icon: Cake, label: "Birthdays" },
  { icon: Building2, label: "Brand activations" },
  { icon: PartyPopper, label: "Office parties" },
  { icon: GraduationCap, label: "Graduations" },
  { icon: Music, label: "Festivals & concerts" },
];
