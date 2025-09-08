import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ChevronUpIcon, ChevronDownIcon } from "./Icons";

const SimpleFoldableEditorPane = ({
  label,
  icon,
  value,
  onChange,
  isCollapsed,
  onToggle,
  language,
}) => {
  const lineNumbersRef = useRef(null);
  const textAreaRef = useRef(null);
  const [foldedLines, setFoldedLines] = useState(new Set());

  // Find foldable line ranges
  const foldableRanges = useMemo(() => {
    const lines = value.split("\n");
    const ranges = [];
    const stack = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // HTML tags
      if (language === "html") {
        if (trimmed.match(/<(\w+)(?:\s[^>]*)?>/)) {
          const tagMatch = trimmed.match(/<(\w+)/);
          if (tagMatch && !trimmed.includes(`</${tagMatch[1]}>`)) {
            stack.push({ start: lineNum, tag: tagMatch[1] });
          }
        }
        if (trimmed.includes("</")) {
          const tagMatch = trimmed.match(/<\/(\w+)>/);
          if (tagMatch && stack.length > 0) {
            const lastOpen = stack.pop();
            if (lastOpen && lastOpen.tag === tagMatch[1]) {
              ranges.push({ start: lastOpen.start, end: lineNum });
            }
          }
        }
      }

      // CSS rules
      if (language === "css") {
        if (trimmed.includes("{") && !trimmed.includes("}")) {
          stack.push({ start: lineNum });
        }
        if (trimmed.includes("}") && stack.length > 0) {
          const lastOpen = stack.pop();
          if (lastOpen) {
            ranges.push({ start: lastOpen.start, end: lineNum });
          }
        }
      }

      // JavaScript blocks
      if (language === "javascript") {
        if (
          trimmed.match(/(function|if|for|while|class|\w+\s*=>|\w+\s*:).*{/) &&
          !trimmed.includes("}")
        ) {
          stack.push({ start: lineNum });
        }
        if (trimmed === "}" && stack.length > 0) {
          const lastOpen = stack.pop();
          if (lastOpen) {
            ranges.push({ start: lastOpen.start, end: lineNum });
          }
        }
      }
    });

    return ranges;
  }, [value, language]);

  // Generate display code with folded lines
  const displayCode = useMemo(() => {
    if (foldedLines.size === 0) return value;

    const lines = value.split("\n");
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const range = foldableRanges.find(
        (r) => r.start === lineNum && foldedLines.has(lineNum)
      );

      if (range) {
        // Add the start line and fold indicator
        result.push(lines[i] + " ⟨...⟩");
        // Skip to end line
        i = range.end - 1;
      } else if (
        !foldableRanges.some(
          (r) =>
            lineNum > r.start && lineNum < r.end && foldedLines.has(r.start)
        )
      ) {
        // Only add line if it's not inside a folded range
        result.push(lines[i]);
      }
    }

    return result.join("\n");
  }, [value, foldedLines, foldableRanges]);

  const lineCount = displayCode.split("\n").length;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleScroll = useCallback(() => {
    if (lineNumbersRef.current && textAreaRef.current) {
      lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  }, []);

  const toggleFold = useCallback((lineNum) => {
    setFoldedLines((prev) => {
      const newFolded = new Set(prev);
      if (newFolded.has(lineNum)) {
        newFolded.delete(lineNum);
      } else {
        newFolded.add(lineNum);
      }
      return newFolded;
    });
  }, []);

  const handleTextareaChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div
      className={`flex flex-col bg-gray-800 overflow-hidden ${
        isCollapsed ? "flex-grow-0 flex-shrink-0" : "flex-1"
      }`}
    >
      <div
        className="flex items-center justify-between p-3 bg-gray-900 text-gray-400 border-b border-gray-700 cursor-pointer select-none"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="p-1">
          {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </div>
      </div>

      <div
        className={`flex flex-1 relative overflow-hidden ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        <div
          ref={lineNumbersRef}
          className="pl-4 pr-2 pt-4 pb-4 bg-gray-800 text-right text-gray-500 font-mono text-sm select-none overflow-y-hidden relative"
        >
          {lines.map((lineNumber) => {
            const range = foldableRanges.find((r) => r.start === lineNumber);
            return (
              <div
                key={lineNumber}
                className="flex items-center justify-end gap-1"
              >
                {range && (
                  <button
                    className={`text-xs px-1 ${
                      foldedLines.has(lineNumber)
                        ? "text-blue-400"
                        : "text-gray-500"
                    } hover:text-blue-300`}
                    onClick={() => toggleFold(lineNumber)}
                  >
                    {foldedLines.has(lineNumber) ? "▶" : "▼"}
                  </button>
                )}
                <span>{lineNumber}</span>
              </div>
            );
          })}
        </div>

        <textarea
          ref={textAreaRef}
          value={displayCode}
          onChange={handleTextareaChange}
          onScroll={handleScroll}
          className="w-full h-full p-4 pl-2 bg-gray-800 text-gray-100 font-mono text-sm resize-none focus:outline-none"
          placeholder={`Write your ${label} code here...`}
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default SimpleFoldableEditorPane;
