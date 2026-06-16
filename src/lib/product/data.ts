import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileSearch,
  Globe2,
  Mic2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  WalletCards
} from "lucide-react";

export const brand = {
  name: "PrepPilot",
  tagline: "Professional AI career coaching for every interview path.",
  description:
    "Practice interviews, match resumes to job descriptions, negotiate salary, and track readiness with a calm, professional AI coach."
};

export const audiences = [
  "Students",
  "Interns",
  "Freshers",
  "Experienced professionals",
  "Career switchers",
  "India and international candidates"
];

export const featureCards = [
  {
    icon: Sparkles,
    title: "AI mock HR round",
    description:
      "Practice introductions, strengths, weaknesses, career goals, and behavioral questions with soft but precise coaching."
  },
  {
    icon: BriefcaseBusiness,
    title: "AI technical round",
    description:
      "Generate role-specific technical questions for any field and receive structured scoring on depth and clarity."
  },
  {
    icon: FileSearch,
    title: "Resume + JD matching",
    description:
      "Compare your resume against a job description and find matched skills, missing signals, and improvement actions."
  },
  {
    icon: WalletCards,
    title: "Salary negotiation simulator",
    description:
      "Practice salary expectations and HR pushback with free limited coaching and premium-ready deeper insights."
  },
  {
    icon: Building2,
    title: "Company-specific prep",
    description:
      "Prepare for target companies with interview context, role expectations, and tailored practice modes."
  },
  {
    icon: Mic2,
    title: "Voice-ready roadmap",
    description:
      "Text-first MVP with Phase 2 architecture for voice practice, filler-word detection, pace, and confidence scoring."
  }
];

export const premiumCards = [
  {
    icon: BarChart3,
    title: "Weekly improvement reports",
    description:
      "Track strengths, weak areas, consistency, readiness movement, and recommended next practice."
  },
  {
    icon: Trophy,
    title: "Streaks and leaderboard",
    description:
      "Encourage consistent practice without making the product feel childish or distracting."
  },
  {
    icon: Award,
    title: "Interview readiness certificate",
    description:
      "Generate a practice-based certificate once the candidate reaches a strong readiness threshold."
  },
  {
    icon: ShieldCheck,
    title: "Professional guardrails",
    description:
      "Selection chance is framed responsibly as a readiness estimate, never as a guaranteed hiring result."
  }
];

export const dashboardStats = [
  { label: "Readiness", value: "78", suffix: "/100" },
  { label: "Practice streak", value: "6", suffix: " days" },
  { label: "Resume match", value: "84", suffix: "%" },
  { label: "Salary confidence", value: "72", suffix: "%" }
];

export const modeOptions = [
  { value: "hr", label: "HR Round" },
  { value: "technical", label: "Technical Round" },
  { value: "behavioral", label: "Behavioral Round" },
  { value: "company_prep", label: "Company Prep" }
];

export const regionOptions = [
  { value: "both", label: "India + International", icon: Globe2 },
  { value: "india", label: "India focused", icon: Target },
  { value: "international", label: "International focused", icon: Globe2 }
];

