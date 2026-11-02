import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  // Parse markdown into segments: code blocks vs text blocks
  const parts: React.ReactNode[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let textBuffer: string[] = [];

  const flushText = (keyPrefix: string) => {
    if (textBuffer.length === 0) return;
    const currentText = textBuffer.join('\n');
    textBuffer = [];

    // Parse paragraphs, headers, lists
    const textLines = currentText.split('\n');
    const elements: React.ReactNode[] = [];

    let currentList: string[] = [];
    let isOrderedList = false;

    const flushList = (listKey: string) => {
      if (currentList.length === 0) return;
      if (isOrderedList) {
        elements.push(
          <ol key={listKey} className="list-decimal pl-5 space-y-1 my-2">
            {currentList.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={listKey} className="list-disc pl-5 space-y-1 my-2">
            {currentList.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
    };

    textLines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList(`list-${index}`);
        elements.push(
          <h4 key={`h3-${index}`} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">
            {renderInline(trimmed.slice(4))}
          </h4>
        );
        return;
      }
      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList(`list-${index}`);
        elements.push(
          <h3 key={`h2-${index}`} className="text-base font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5">
            {renderInline(trimmed.slice(3))}
          </h3>
        );
        return;
      }
      // Heading 1
      if (trimmed.startsWith('# ')) {
        flushList(`list-${index}`);
        elements.push(
          <h2 key={`h1-${index}`} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
            {renderInline(trimmed.slice(2))}
          </h2>
        );
        return;
      }

      // Unordered list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (isOrderedList) flushList(`list-${index}`);
        isOrderedList = false;
        currentList.push(trimmed.slice(2));
        return;
      }

      // Ordered list item (e.g. "1. ")
      const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
      if (orderedMatch) {
        if (!isOrderedList) flushList(`list-${index}`);
        isOrderedList = true;
        currentList.push(orderedMatch[1]);
        return;
      }

      // Empty line
      if (!trimmed) {
        flushList(`list-${index}`);
        return;
      }

      // Regular paragraph
      flushList(`list-${index}`);
      elements.push(
        <p key={`p-${index}`} className="my-1.5 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    });

    flushList(`list-final`);
    parts.push(
      <div key={keyPrefix} className="space-y-1">
        {elements}
      </div>
    );
  };

  lines.forEach((line, idx) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Entering code block
        flushText(`text-${idx}`);
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeBuffer = [];
      } else {
        // Exiting code block
        inCodeBlock = false;
        const codeText = codeBuffer.join('\n');
        parts.push(
          <CodeBlockSnippet key={`code-${idx}`} code={codeText} language={codeLang} />
        );
        codeBuffer = [];
        codeLang = '';
      }
    } else if (inCodeBlock) {
      codeBuffer.push(line);
    } else {
      textBuffer.push(line);
    }
  });

  // Any remaining text or open code block
  if (inCodeBlock) {
    parts.push(
      <CodeBlockSnippet key="code-tail" code={codeBuffer.join('\n')} language={codeLang} />
    );
  } else {
    flushText('text-tail');
  }

  return <div className="text-xs sm:text-[13px] leading-relaxed break-words">{parts}</div>;
};

// Inline Markdown Parser: **bold**, *italic*, `code`, [link](url)
function renderInline(text: string): React.ReactNode {
  // Regex splitting by backticks for inline code
  const tokens = text.split(/(`[^`]+`)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] border border-slate-200 dark:border-slate-700"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    // Process bold (**bold**) and italics (*italic*)
    const boldTokens = token.split(/(\*\*[^*]+\*\*)/g);
    return boldTokens.map((bToken, j) => {
      if (bToken.startsWith('**') && bToken.endsWith('**') && bToken.length > 4) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold text-slate-900 dark:text-white">
            {bToken.slice(2, -2)}
          </strong>
        );
      }
      return bToken;
    });
  });
}

const CodeBlockSnippet: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2.5 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-200">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
        <span className="font-mono uppercase">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[11px] sm:text-xs font-mono leading-relaxed text-emerald-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};
