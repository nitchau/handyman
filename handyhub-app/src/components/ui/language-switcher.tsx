"use client";

import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation, type Locale } from "@/lib/i18n/language-context";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2">
          <Globe className="size-4" />
          <span className="text-xs font-medium uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="gap-2"
          >
            {locale === lang.code && <Check className="size-3.5" />}
            {locale !== lang.code && <span className="size-3.5" />}
            <span className={locale === lang.code ? "font-semibold" : ""}>
              {lang.label}
            </span>
            <span className="ml-auto text-xs text-muted-foreground uppercase">
              {lang.code}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
