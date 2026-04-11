"use client";

import dynamic from "next/dynamic";
import React from "react";

const TokenizerPlayground = dynamic(() => import("./TokenizerPlayground"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-900/50 rounded-xl animate-pulse" />
});

export default function TokenizerWrapper() {
  return <TokenizerPlayground />;
}
