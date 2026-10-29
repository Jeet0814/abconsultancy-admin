import {
  ShieldCheck,
  TrendingUp,
  FileText,
  ReceiptText,
  HeartHandshake,
  Activity,
  Car,
  Briefcase,
  PiggyBank,
  Wallet,
  Coins,
  Receipt,
  FileSpreadsheet,
  Building2,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  TrendingUp,
  FileText,
  ReceiptText,
  HeartHandshake,
  Activity,
  Car,
  Briefcase,
  PiggyBank,
  Wallet,
  Coins,
  Receipt,
  FileSpreadsheet,
  Building2,
  Landmark,
  insurance: ShieldCheck,
  investments: TrendingUp,
  "income-tax": FileText,
  gst: ReceiptText,
};

export function getLucideIcon(nameOrSlug?: string, fallback: LucideIcon = ShieldCheck): LucideIcon {
  if (!nameOrSlug) return fallback;
  return iconMap[nameOrSlug] || fallback;
}

