"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TokenizerPlayground = dynamic(() => import("../../tokenomics/module-1/TokenizerPlayground"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const MultilingualTokenSimulator = dynamic(() => import("../../../components/MultilingualTokenSimulator"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const OutputCostSimulator = dynamic(() => import("../../../components/OutputCostSimulator"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const ReverseBudgetPlannerDemo = dynamic(() => import("../../../components/ReverseBudgetPlannerDemo"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const PromptCompressionDemo = dynamic(() => import("../../../components/PromptCompressionDemo"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const WorkflowSimulator = dynamic(() => import("../../../components/WorkflowSimulator"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const MultimodalEstimator = dynamic(() => import("../../../components/MultimodalEstimator"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const MiniTokenCalculator = dynamic(() => import("../../../components/MiniTokenCalculator"), {
  loading: () => <div className="h-48 w-full animate-pulse bg-slate-900 rounded-xl border border-slate-800" />,
  ssr: false
});

const LiteModelComparison = dynamic(() => import("../../../components/LiteModelComparison"), {
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

  // Handle placeholders
  let renderedContent: React.ReactNode[] = [<div key="initial" dangerouslySetInnerHTML={{ __html: content }} />];

  // Tokenizer Playground
  if (content.includes('{{TOKENIZER_PLAYGROUND}}')) {
    const parts = content.split('{{TOKENIZER_PLAYGROUND}}');
    const newElements: React.ReactNode[] = [];
    parts.forEach((part, i) => {
      newElements.push(<div key={`tp-part-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
      if (i < parts.length - 1) {
        newElements.push(
          <div key={`tp-comp-${i}`} className="my-12 not-prose">
            <TokenizerPlayground />
          </div>
        );
      }
    });
    renderedContent = newElements;
  }

  // Multilingual Simulator
  const midElements: React.ReactNode[] = [];
  renderedContent.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{MULTILINGUAL_SIMULATOR}}')) {
        const parts = html.split('{{MULTILINGUAL_SIMULATOR}}');
        parts.forEach((part, i) => {
          midElements.push(<div key={`ms-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            midElements.push(
              <div key={`ms-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <MultilingualTokenSimulator />
              </div>
            );
          }
        });
      } else {
        midElements.push(node);
      }
    } else {
      midElements.push(node);
    }
  });

  // Output Cost Simulator
  const outElements: React.ReactNode[] = [];
  midElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{OUTPUT_COST_SIMULATOR}}')) {
        const parts = html.split('{{OUTPUT_COST_SIMULATOR}}');
        parts.forEach((part, i) => {
          outElements.push(<div key={`ocs-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            outElements.push(
              <div key={`ocs-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <OutputCostSimulator />
              </div>
            );
          }
        });
      } else {
        outElements.push(node);
      }
    } else {
      outElements.push(node);
    }
  });

  // Reverse Budget Planner
  const rbpElements: React.ReactNode[] = [];
  outElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{REVERSE_BUDGET_PLANNER}}')) {
        const parts = html.split('{{REVERSE_BUDGET_PLANNER}}');
        parts.forEach((part, i) => {
          rbpElements.push(<div key={`rbp-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            rbpElements.push(
              <div key={`rbp-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <ReverseBudgetPlannerDemo />
              </div>
            );
          }
        });
      } else {
        rbpElements.push(node);
      }
    } else {
      rbpElements.push(node);
    }
  });

  // Prompt Compression Demo
  const pcdElements: React.ReactNode[] = [];
  rbpElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{PROMPT_COMPRESSION_DEMO}}')) {
        const parts = html.split('{{PROMPT_COMPRESSION_DEMO}}');
        parts.forEach((part, i) => {
          pcdElements.push(<div key={`pcd-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            pcdElements.push(
              <div key={`pcd-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <PromptCompressionDemo />
              </div>
            );
          }
        });
      } else {
        pcdElements.push(node);
      }
    } else {
      pcdElements.push(node);
    }
  });

  // Agent Loop Simulator
  const alsElements: React.ReactNode[] = [];
  pcdElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{AGENT_LOOP_SIMULATOR}}')) {
        const parts = html.split('{{AGENT_LOOP_SIMULATOR}}');
        parts.forEach((part, i) => {
          alsElements.push(<div key={`als-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            alsElements.push(
              <div key={`als-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <WorkflowSimulator />
              </div>
            );
          }
        });
      } else {
        alsElements.push(node);
      }
    } else {
      alsElements.push(node);
    }
  });

  // Multimodal Estimator
  const meElements: React.ReactNode[] = [];
  alsElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{MULTIMODAL_ESTIMATOR}}')) {
        const parts = html.split('{{MULTIMODAL_ESTIMATOR}}');
        parts.forEach((part, i) => {
          meElements.push(<div key={`me-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            meElements.push(
              <div key={`me-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <MultimodalEstimator />
              </div>
            );
          }
        });
      } else {
        meElements.push(node);
      }
    } else {
      meElements.push(node);
    }
  });

  // Mini Token Calculator
  const miniElements: React.ReactNode[] = [];
  meElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{MINI_CALCULATOR}}')) {
        const parts = html.split('{{MINI_CALCULATOR}}');
        parts.forEach((part, i) => {
          miniElements.push(<div key={`mini-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            miniElements.push(
              <div key={`mini-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <MiniTokenCalculator />
              </div>
            );
          }
        });
      } else {
        miniElements.push(node);
      }
    } else {
      miniElements.push(node);
    }
  });

  // Lite Model Comparison
  const finalElements: React.ReactNode[] = [];
  miniElements.forEach((node, nodeIdx) => {
    if (React.isValidElement(node) && (node.props as any).dangerouslySetInnerHTML) {
      const html = (node.props as any).dangerouslySetInnerHTML.__html;
      if (html.includes('{{LITE_MODEL_COMPARISON}}')) {
        const parts = html.split('{{LITE_MODEL_COMPARISON}}');
        parts.forEach((part, i) => {
          finalElements.push(<div key={`lite-part-${nodeIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
          if (i < parts.length - 1) {
            finalElements.push(
              <div key={`lite-comp-${nodeIdx}-${i}`} className="my-12 not-prose">
                <LiteModelComparison />
              </div>
            );
          }
        });
      } else {
        finalElements.push(node);
      }
    } else {
      finalElements.push(node);
    }
  });

  return <>{finalElements}</>;
}
