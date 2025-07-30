import { Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return <Maximize className={cn("h-6 w-6", className)} />;
}
