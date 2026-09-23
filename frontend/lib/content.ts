// Structured static content for the AKSSADA public site.
//
// Everything here reflects verified organizational information only.
// Nothing marked as a "goal" or "target" should ever be presented as
// completed impact. This file is the single source of truth for copy
// until the Spring Boot API supplies dynamic content (Initiatives,
// Stories) in a later phase.

export const org = {
  name: "AKSSADA",
  fullName:
    "All Karnataka Siddi Social & Aspirational Diversification Association",
  mission:
    "AKSSADA is a Section 8 non-profit working alongside the Siddi community and other forest-dwelling communities in Karnataka to build sustainable livelihoods, expand access to education, protect cultural heritage, and strengthen the environment they depend on.",
};

export type FocusArea = {
  slug: string;
  title: string;
  description: string;
};

export const focusAreas: FocusArea[] = [
  {
    slug: "sustainable-livelihoods",
    title: "Sustainable Livelihoods",
    description:
      "Beekeeping, medicinal plant nurseries, eco-tourism, and animal husbandry that let families earn from the forest without depleting it.",
  },
  {
    slug: "education-skills",
    title: "Education & Skills",
    description:
      "Literacy programs, vocational training, and digital literacy that open doors beyond the village.",
  },
  {
    slug: "cultural-heritage",
    title: "Cultural Heritage",
    description:
      "Supporting Dhamal dance, Kawandi quilting, and music as living traditions, not museum pieces.",
  },
  {
    slug: "environmental-protection",
    title: "Environmental Protection",
    description:
      "Reforestation, forest-fire prevention, waste management, and eco-farming led by the communities who live closest to the land.",
  },
  {
    slug: "youth-leadership",
    title: "Youth Leadership",
    description:
      "Sports and leadership programs that give young people a path to state and national participation.",
  },
];

export type FeaturedInitiative = {
  slug: string;
  title: string;
  focusArea: string;
  status: "Pilot initiative" | "Planned" | "Focus area";
  description: string;
};

export const featuredInitiatives: FeaturedInitiative[] = [
  {
    slug: "beekeeping-sustainable-livelihoods",
    title: "Beekeeping & Sustainable Livelihoods",
    focusArea: "Sustainable Livelihoods",
    status: "Pilot initiative",
    description:
      "Pilot beekeeping projects designed with women's groups, built as a repeatable model for forest-based income.",
  },
  {
    slug: "medicinal-plant-nurseries",
    title: "Medicinal Plant Nurseries",
    focusArea: "Sustainable Livelihoods",
    status: "Planned",
    description:
      "Nurseries to grow and distribute medicinal plant saplings, supporting both income and traditional knowledge.",
  },
  {
    slug: "youth-community-development",
    title: "Youth & Community Development",
    focusArea: "Youth Leadership",
    status: "Focus area",
    description:
      "Sports and leadership programs that connect young people in forest-dwelling communities to wider opportunity.",
  },
];

export type Goal = {
  value: string;
  label: string;
};

// These are AKSSADA's stated 3-year goals, not achieved figures.
export const threeYearGoals: Goal[] = [
  { value: "10+", label: "Villages targeted for livelihood training" },
  { value: "3", label: "Pilot beekeeping projects for women's groups" },
  { value: "10,000", label: "Medicinal plant saplings targeted" },
  { value: "Youth", label: "Sports & cultural initiatives" },
];

export const getInvolvedOptions = [
  {
    slug: "support",
    title: "Donate",
    description: "Support community-led initiatives directly.",
  },
  {
    slug: "volunteer",
    title: "Volunteer",
    description: "Contribute your time and skills.",
  },
  {
    slug: "partner",
    title: "Partner",
    description:
      "Work with AKSSADA on sustainable community initiatives as an NGO, corporate CSR partner, or educational institution.",
  },
];

export const primaryNav = [
  { href: "/about", label: "About" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/stories", label: "Stories" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = [
  { href: "/about", label: "About" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/stories", label: "Stories" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

export const footerGetInvolved = [
  { href: "/support", label: "Donate" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/partner", label: "Partner" },
];
