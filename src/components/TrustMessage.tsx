'use client';

import React from 'react';
import { Lock } from 'lucide-react';

export default function TrustMessage() {
  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
      <Lock className="w-4 h-4 text-blue-500" />
      <span>100% Client-Side — Your prompts never leave your browser.</span>
    </div>
  );
}
