import {
  BriefcaseBusiness,
  Crown,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ServiceSlug = "corporate" | "private" | "weddings" | "vip";

type ServiceStep = {
  title: string;
  description: string;
};

type ServiceTheme = {
  pageBackground: string;
  text: string;
  heroOverlay: string;
  panel: string;
  panelAlt: string;
  chip: string;
  accent: string;
  buttonPrimary: string;
  buttonSecondary: string;
};

export type ServiceDetail = {
  slug: ServiceSlug;
  translationKey: ServiceSlug;
  icon: LucideIcon;
  cardImage: string;
  heroImage: string;
  eyebrow: string;
  overview: string[];
  included: string[];
  idealFor: string[];
  steps: ServiceStep[];
  theme: ServiceTheme;
};

export const SERVICE_ORDER: ServiceSlug[] = [
  "corporate",
  "private",
  "weddings",
  "vip",
];

export const SERVICE_DETAILS: Record<ServiceSlug, ServiceDetail> = {
  corporate: {
    slug: "corporate",
    translationKey: "corporate",
    icon: BriefcaseBusiness,
    cardImage: "/event-corporate.png",
    heroImage: "/event-corporate.png",
    eyebrow: "Precision for business-hosted moments",
    overview: [
      "Corporate catering is built for timing discipline, smooth guest movement, and premium presentation from first arrival to final coffee service.",
      "From board lunches and investor receptions to product launches, we design menus that stay polished under fast schedules and high expectations.",
    ],
    included: [
      "Executive menu planning with dietary mapping",
      "On-site coordination and timed service flow",
      "Brand-aligned presentation and buffet styling",
      "Post-event cleanup and operations wrap-up",
    ],
    idealFor: [
      "Board meetings and leadership offsites",
      "Product launches and media events",
      "Client dinners and annual celebrations",
    ],
    steps: [
      {
        title: "Brief and Scope",
        description: "We align on audience profile, format, and outcomes for the event.",
      },
      {
        title: "Menu and Logistics",
        description: "Service cadence, stations, and staffing are mapped to your schedule.",
      },
      {
        title: "Execute and Host",
        description: "Our team runs setup through service close with low-friction delivery.",
      },
    ],
    theme: {
      pageBackground:
        "bg-[radial-gradient(circle_at_top,_#1f3b67_0%,_#0f1f39_45%,_#081222_100%)]",
      text: "text-slate-100",
      heroOverlay:
        "bg-gradient-to-r from-[#081222]/95 via-[#0f1f39]/80 to-[#0f1f39]/30",
      panel: "bg-[#0e213d]/75 border border-blue-200/20",
      panelAlt: "bg-[#12284b]/70 border border-blue-200/20",
      chip: "bg-blue-200/15 border border-blue-200/30 text-blue-100",
      accent: "text-blue-200",
      buttonPrimary:
        "bg-blue-200 text-[#0b1a33] hover:bg-blue-100 border border-blue-100",
      buttonSecondary:
        "border border-blue-200/35 text-blue-50 hover:bg-blue-200/10",
    },
  },
  private: {
    slug: "private",
    translationKey: "private",
    icon: Sparkles,
    cardImage: "/service-private.png",
    heroImage: "/service-private.png",
    eyebrow: "Curated moments in intimate settings",
    overview: [
      "Private occasion service focuses on atmosphere, personality, and thoughtful pacing tailored to your home or selected venue.",
      "Whether for milestone birthdays, dinner parties, or family celebrations, each course is composed to match your guests and mood.",
    ],
    included: [
      "Custom menu workshop with your host preferences",
      "Service style options from plated to family-style",
      "Signature beverage pairing recommendations",
      "On-site culinary and hosting support",
    ],
    idealFor: [
      "Dinner parties and milestone birthdays",
      "Family celebrations and private receptions",
      "Boutique gatherings with curated themes",
    ],
    steps: [
      {
        title: "Mood and Vision",
        description: "We define tone, guest experience, and preferred culinary direction.",
      },
      {
        title: "Tasting and Refinement",
        description: "Menu, presentation, and service style are fine-tuned with you.",
      },
      {
        title: "Elevated Hosting",
        description: "Your event is delivered with discreet, guest-first execution.",
      },
    ],
    theme: {
      pageBackground:
        "bg-[radial-gradient(circle_at_top,_#50324f_0%,_#2d1830_45%,_#170d1b_100%)]",
      text: "text-rose-50",
      heroOverlay:
        "bg-gradient-to-r from-[#1b0d1f]/90 via-[#2d1830]/75 to-[#2d1830]/30",
      panel: "bg-[#2f1932]/70 border border-rose-200/20",
      panelAlt: "bg-[#3a2040]/70 border border-rose-200/20",
      chip: "bg-rose-200/15 border border-rose-200/30 text-rose-100",
      accent: "text-rose-200",
      buttonPrimary:
        "bg-rose-200 text-[#2b1230] hover:bg-rose-100 border border-rose-100",
      buttonSecondary:
        "border border-rose-200/35 text-rose-50 hover:bg-rose-200/10",
    },
  },
  weddings: {
    slug: "weddings",
    translationKey: "weddings",
    icon: Heart,
    cardImage: "/service-wedding.png",
    heroImage: "/service-wedding.png",
    eyebrow: "Soft, romantic, and celebration-first",
    overview: [
      "Wedding service is crafted around emotion, ceremony timing, and a warm dining atmosphere that feels effortless for every guest.",
      "From welcome reception to final toast, we choreograph kitchen and floor operations so your day stays elegant and uninterrupted.",
    ],
    included: [
      "Wedding day culinary timeline and tasting session",
      "Multi-course dinner planning with dessert coordination",
      "Couple-first service and head-table attention",
      "Guest dietary handling and hospitality staffing",
    ],
    idealFor: [
      "Classic ballroom and garden weddings",
      "Destination or outdoor ceremonies",
      "Modern receptions with tasting-menu format",
    ],
    steps: [
      {
        title: "Story and Style",
        description: "Your wedding aesthetic and flavor profile define the culinary concept.",
      },
      {
        title: "Timeline Alignment",
        description: "Menu moments are synced with ceremony, speeches, and key rituals.",
      },
      {
        title: "Flawless Celebration",
        description: "Service teams execute quietly so focus remains on your celebration.",
      },
    ],
    theme: {
      pageBackground:
        "bg-[radial-gradient(circle_at_top,_#f6ecdc_0%,_#eadcc9_45%,_#dbc8af_100%)]",
      text: "text-stone-900",
      heroOverlay:
        "bg-gradient-to-r from-[#4f3d2f]/70 via-[#8f765c]/35 to-[#eadcc9]/20",
      panel: "bg-[#fffaf1]/90 border border-[#d7c2a6]",
      panelAlt: "bg-[#f4eadc]/95 border border-[#d7c2a6]",
      chip: "bg-[#f5e8d6] border border-[#ccb08f] text-[#6f4d2f]",
      accent: "text-[#8a5b35]",
      buttonPrimary:
        "bg-[#8a5b35] text-amber-50 hover:bg-[#764c2d] border border-[#764c2d]",
      buttonSecondary:
        "border border-[#8a5b35]/50 text-[#6f4d2f] hover:bg-[#8a5b35]/10",
    },
  },
  vip: {
    slug: "vip",
    translationKey: "vip",
    icon: Crown,
    cardImage: "/hero-food.png",
    heroImage: "/hero-food.png",
    eyebrow: "White-glove culinary performance",
    overview: [
      "VIP service is designed for hosts who expect absolute precision, rare ingredients, and individualized guest treatment across every touchpoint.",
      "This offering combines premium sourcing, senior culinary leadership, and elevated event orchestration for high-visibility occasions.",
    ],
    included: [
      "Bespoke menu design with top-tier ingredient sourcing",
      "Senior chef leadership and VIP guest service protocol",
      "Sommelier-ready pairings and table-side moments",
      "End-to-end production oversight with concierge support",
    ],
    idealFor: [
      "Executive and diplomatic hosting",
      "Luxury private events and premieres",
      "Milestone occasions requiring discreet excellence",
    ],
    steps: [
      {
        title: "Concierge Discovery",
        description: "We gather precise guest preferences, constraints, and target ambiance.",
      },
      {
        title: "Bespoke Production",
        description: "Kitchen, service, and sensory details are engineered to your brief.",
      },
      {
        title: "White-Glove Delivery",
        description: "A dedicated lead team oversees every guest moment in real time.",
      },
    ],
    theme: {
      pageBackground:
        "bg-[radial-gradient(circle_at_top,_#40351f_0%,_#1f1a11_45%,_#0b0906_100%)]",
      text: "text-amber-50",
      heroOverlay:
        "bg-gradient-to-r from-[#0b0906]/92 via-[#1f1a11]/78 to-[#1f1a11]/38",
      panel: "bg-[#17130d]/80 border border-amber-200/20",
      panelAlt: "bg-[#1f1a11]/75 border border-amber-200/20",
      chip: "bg-amber-200/15 border border-amber-200/30 text-amber-100",
      accent: "text-amber-200",
      buttonPrimary:
        "bg-amber-200 text-[#1f1a11] hover:bg-amber-100 border border-amber-100",
      buttonSecondary:
        "border border-amber-200/35 text-amber-50 hover:bg-amber-200/10",
    },
  },
};

export function getServiceDetail(service: string): ServiceDetail | null {
  if (service in SERVICE_DETAILS) {
    return SERVICE_DETAILS[service as ServiceSlug];
  }
  return null;
}

export function resolveServiceSlug(params: {
  name?: string;
  isVIP?: boolean;
  index?: number;
}): ServiceSlug {
  if (params.isVIP) return "vip";

  const source = (params.name ?? "").toLowerCase();
  if (source.includes("wed")) return "weddings";
  if (source.includes("priv")) return "private";
  if (source.includes("corp") || source.includes("business")) return "corporate";
  if (source.includes("vip")) return "vip";

  return SERVICE_ORDER[(params.index ?? 0) % SERVICE_ORDER.length];
}
