"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

function useTypewriter(text: string, speed = 60, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(tick); setDone(true); }
      }, speed);
      return () => clearInterval(tick);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

export default function HeroHeadline() {
  const t = useTranslations("hero");
  const { displayed, done } = useTypewriter(t("headline_word"), 65, 500);
  return (
    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground mt-0 text-balance">
      {t("headline_1")} <br className="hidden lg:block" />
      {t("headline_2")}{" "}
      <span className="bg-gradient-to-r from-plasma-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {displayed}
        <span
          className="inline-block w-[3px] h-[0.85em] ml-0.5 align-middle rounded-sm bg-plasma-400"
          style={{
            animation: done ? "cursor-blink 1s step-end infinite" : "none",
            opacity: done ? undefined : 1,
          }}
        />
      </span>
    </h1>
  );
}
