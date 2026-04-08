"use client";

import { useTranslations } from "next-intl";

export default function HeroHeadline() {
  const t = useTranslations("hero");
  
  return (
    <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.2] lg:leading-[1.1] text-foreground mt-0 text-balance text-center lg:text-left mx-auto lg:mx-0 w-full max-w-[100vw] overflow-hidden">
      {t("headline_1")} <br className="hidden lg:block" />
      {t("headline_2")}{" "}
      <span className="bg-gradient-to-r from-plasma-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {t("headline_word")}
      </span>
    </h1>
  );
}
