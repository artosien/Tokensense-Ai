"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TokenizerPlayground = dynamic(() => import("../../tokenomics/module-1/TokenizerPlayground"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Split content by the placeholder
  const parts = content.split('{{TOKENIZER_PLAYGROUND}}');

  if (parts.length === 1) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <div dangerouslySetInnerHTML={{ __html: part }} />
          {index < parts.length - 1 && (
            <div className="my-12 not-prose">
              <TokenizerPlayground />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
