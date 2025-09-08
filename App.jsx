import React, { useState, useEffect, useRef } from "react";
import { generateCode, formatCode } from "./services/geminiService";
import {
  downloadCodeAsZip,
  downloadCodeAsZipWithPathSelection,
  downloadCodeAsZipToDefault,
  downloadIndividualFiles,
} from "./services/downloadService";
import {
  HtmlIcon,
  CssIcon,
  JsIcon,
  MagicIcon,
  CloseIcon,
  SpinnerIcon,
  FormatIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DownloadIcon,
} from "./components/Icons";
import { DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS } from "./constants";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./contexts/ToastContext";
import Header from "./components/Header";
import SimpleFoldableEditorPane from "./components/FoldableEditorPane";

const App = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [srcDoc, setSrcDoc] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [error, setError] = useState(null);

  const [editorHeight, setEditorHeight] = useState(300);
  const mainRef = useRef(null);

  const [collapsedEditors, setCollapsedEditors] = useState({
    html: false,
    css: false,
    js: false,
  });

  const handleToggleEditor = (editor) => {
    setCollapsedEditors((prev) => ({ ...prev, [editor]: !prev[editor] }));
  };

  useEffect(() => {
    if (mainRef.current) {
      setEditorHeight(mainRef.current.offsetHeight / 2);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
                <html>
                    <body>${htmlCode}</body>
                    <style>${cssCode}</style>
                    <script>${jsCode}</script>
                </html>
            `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode]);

  const handleGenerateCode = async () => {
    if (!aiPrompt) {
      setError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateCode(aiPrompt);
      if (result) {
        setHtmlCode(result.html || "");
        setCssCode(result.css || "");
        setJsCode(result.javascript || "");
        setIsModalOpen(false);
        setAiPrompt("");
      } else {
        setError("Failed to generate code. The AI returned an empty response.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatCode = async () => {
    setIsFormatting(true);
    try {
      const result = await formatCode({
        html: htmlCode,
        css: cssCode,
        javascript: jsCode,
      });
      if (result) {
        setHtmlCode(result.html);
        setCssCode(result.css);
        setJsCode(result.javascript);
      } else {
        alert("AI failed to format the code.");
      }
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "An unknown formatting error occurred."
      );
    } finally {
      setIsFormatting(false);
    }
  };

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const handleDownload = async () => {
    try {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `ai-codepen-export-${timestamp}`;
      await downloadCodeAsZip(htmlCode, cssCode, jsCode, filename);
    } catch (error) {
      alert("Failed to download files: " + error.message);
    }
  };

  const handleDownloadWithPathSelection = async () => {
    try {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `ai-codepen-export-${timestamp}`;
      const result = await downloadCodeAsZipWithPathSelection(
        htmlCode,
        cssCode,
        jsCode,
        filename
      );

      if (result.success) {
        if (result.method === "filesystem-api") {
          showToast(
            "Files saved successfully to your chosen location! 📁",
            "success"
          );
        } else {
          showToast(`Files downloaded to ${result.path} 📥`, "success");
        }
      } else if (result.cancelled) {
        // User cancelled, no need to show error
        console.log("Download cancelled by user");
      }
    } catch (error) {
      showToast("Failed to download files: " + error.message, "error");
    }
    setShowDownloadOptions(false);
  };

  const handleDownloadToDefault = async () => {
    try {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `ai-codepen-export-${timestamp}`;
      const result = await downloadCodeAsZipToDefault(
        htmlCode,
        cssCode,
        jsCode,
        filename
      );

      if (result.success) {
        showToast(`Files downloaded to ${result.path} 📥`, "success");
      }
    } catch (error) {
      showToast("Failed to download files: " + error.message, "error");
    }
    setShowDownloadOptions(false);
  };

  const handleDownloadIndividualFiles = async () => {
    try {
      const result = await downloadIndividualFiles(
        htmlCode,
        cssCode,
        jsCode,
        true
      );

      if (result.success) {
        showToast(`All files downloaded successfully! 📄`, "success");
      } else if (result.cancelled) {
        console.log("Download cancelled by user");
      }
    } catch (error) {
      showToast(
        "Failed to download individual files: " + error.message,
        "error"
      );
    }
    setShowDownloadOptions(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = editorHeight;

    const handleMouseMove = (moveEvent) => {
      const newHeight = startHeight + (moveEvent.clientY - startY);

      if (mainRef.current) {
        const minHeight = 100;
        const maxHeight = mainRef.current.offsetHeight - 100;
        const clampedHeight = Math.max(
          minHeight,
          Math.min(newHeight, maxHeight)
        );
        setEditorHeight(clampedHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Only render the main app if user is authenticated
  if (!isAuthenticated) {
    return null; // AuthPage will be rendered by the main index.jsx
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header
        onFormatCode={handleFormatCode}
        onGenerateAI={() => setIsModalOpen(true)}
        onDownload={handleDownload}
        onDownloadWithPath={handleDownloadWithPathSelection}
        onDownloadToDefault={handleDownloadToDefault}
        onDownloadIndividual={handleDownloadIndividualFiles}
        isFormatting={isFormatting}
      />

      <main ref={mainRef} className="flex flex-col flex-1 overflow-hidden">
        <div
          style={{ height: `${editorHeight}px` }}
          className="flex flex-col md:flex-row gap-px bg-gray-700 overflow-hidden"
        >
          <SimpleFoldableEditorPane
            label="HTML"
            icon={<HtmlIcon />}
            value={htmlCode}
            onChange={setHtmlCode}
            isCollapsed={collapsedEditors.html}
            onToggle={() => handleToggleEditor("html")}
            language="html"
          />
          <SimpleFoldableEditorPane
            label="CSS"
            icon={<CssIcon />}
            value={cssCode}
            onChange={setCssCode}
            isCollapsed={collapsedEditors.css}
            onToggle={() => handleToggleEditor("css")}
            language="css"
          />
          <SimpleFoldableEditorPane
            label="JavaScript"
            icon={<JsIcon />}
            value={jsCode}
            onChange={setJsCode}
            isCollapsed={collapsedEditors.js}
            onToggle={() => handleToggleEditor("js")}
            language="javascript"
          />
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="w-full h-2 bg-gray-700 cursor-row-resize hover:bg-cyan-400 transition-colors duration-200"
          aria-label="Resize editor pane"
          role="separator"
        />

        <div className="w-full flex-1 bg-white overflow-hidden">
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            width="100%"
            height="100%"
            className="border-none"
          />
        </div>
      </main>

      {isModalOpen && (
        <AiModal
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          isLoading={isLoading}
          error={error}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleGenerateCode}
        />
      )}
    </div>
  );
};

const AiModal = ({
  aiPrompt,
  setAiPrompt,
  isLoading,
  error,
  onClose,
  onSubmit,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl transform transition-all animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <MagicIcon /> AI Code Generator
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="text-gray-400 mb-4">
          Describe the component or animation you want to create. Be as specific
          as possible for the best results.
        </p>

        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="e.g., a pulsating blue button with a white border, or a login form with a cool animation"
          className="w-full h-32 p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"
          disabled={isLoading}
          aria-label="AI prompt input"
        />

        {error && (
          <p
            className="text-red-400 text-sm mb-4 bg-red-900/50 p-3 rounded-md"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50"
          >
            {isLoading ? <SpinnerIcon /> : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
