import JSZip from "jszip";

/**
 * Creates a complete HTML file with embedded CSS and JS
 * @param {string} html - HTML code
 * @param {string} css - CSS code
 * @param {string} js - JavaScript code
 * @returns {string} Complete HTML document
 */
const createCompleteHtmlFile = (html, css, js) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI CodePen Export</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${html}
    <script src="script.js"></script>
</body>
</html>`;
};

/**
 * Check if File System Access API is supported
 * @returns {boolean} Whether the API is supported
 */
const isFileSystemAccessSupported = () => {
  return "showSaveFilePicker" in window;
};

/**
 * Downloads the code as separate HTML, CSS, and JS files in a zip with path selection
 * @param {string} html - HTML code
 * @param {string} css - CSS code
 * @param {string} js - JavaScript code
 * @param {string} filename - Name for the zip file (without extension)
 * @param {boolean} allowPathSelection - Whether to allow user to choose save location
 */
export const downloadCodeAsZip = async (
  html,
  css,
  js,
  filename = "ai-codepen-export",
  allowPathSelection = true
) => {
  try {
    const zip = new JSZip();

    // Create the complete HTML file that references external CSS and JS
    const completeHtml = createCompleteHtmlFile(html, css, js);

    // Add files to zip
    zip.file("index.html", completeHtml);
    zip.file("style.css", css || "/* No CSS code */");
    zip.file("script.js", js || "// No JavaScript code");

    // Add a README file with instructions
    const readme = `# AI CodePen Export

This folder contains your exported code from AI CodePen:

- **index.html** - Main HTML file with structure
- **style.css** - CSS styles
- **script.js** - JavaScript functionality

## How to use:
1. Open index.html in any web browser
2. The CSS and JS files are automatically linked

## Generated on: ${new Date().toLocaleString()}
`;

    zip.file("README.md", readme);

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Try to use File System Access API if supported and requested
    if (allowPathSelection && isFileSystemAccessSupported()) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `${filename}.zip`,
          types: [
            {
              description: "ZIP files",
              accept: {
                "application/zip": [".zip"],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        return {
          success: true,
          method: "filesystem-api",
          path: fileHandle.name,
        };
      } catch (error) {
        if (error.name === "AbortError") {
          // User cancelled the save dialog
          return { success: false, cancelled: true, method: "filesystem-api" };
        }
        // Fall back to traditional download if File System Access fails
        console.warn(
          "File System Access API failed, falling back to traditional download:",
          error
        );
      }
    }

    // Fallback: Traditional download method
    const url = window.URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.zip`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      method: "traditional-download",
      path: "Downloads folder",
    };
  } catch (error) {
    console.error("Error creating zip file:", error);
    throw new Error("Failed to create zip file: " + error.message);
  }
};

/**
 * Downloads the code as a zip with path selection dialog
 * @param {string} html - HTML code
 * @param {string} css - CSS code
 * @param {string} js - JavaScript code
 * @param {string} filename - Name for the zip file (without extension)
 */
export const downloadCodeAsZipWithPathSelection = async (
  html,
  css,
  js,
  filename = "ai-codepen-export"
) => {
  return await downloadCodeAsZip(html, css, js, filename, true);
};

/**
 * Downloads the code as a zip to default location (Downloads folder)
 * @param {string} html - HTML code
 * @param {string} css - CSS code
 * @param {string} js - JavaScript code
 * @param {string} filename - Name for the zip file (without extension)
 */
export const downloadCodeAsZipToDefault = async (
  html,
  css,
  js,
  filename = "ai-codepen-export"
) => {
  return await downloadCodeAsZip(html, css, js, filename, false);
};

/**
 * Downloads individual files separately with optional path selection
 * @param {string} html - HTML code
 * @param {string} css - CSS code
 * @param {string} js - JavaScript code
 * @param {boolean} allowPathSelection - Whether to allow user to choose save location
 */
export const downloadIndividualFiles = async (
  html,
  css,
  js,
  allowPathSelection = true
) => {
  const downloadFile = async (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });

    // Try File System Access API if supported and requested
    if (allowPathSelection && isFileSystemAccessSupported()) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: getFileDescription(mimeType),
              accept: {
                [mimeType]: [getFileExtension(filename)],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return { success: true, method: "filesystem-api", file: filename };
      } catch (error) {
        if (error.name === "AbortError") {
          return { success: false, cancelled: true, file: filename };
        }
        console.warn(
          `File System Access API failed for ${filename}, falling back:`,
          error
        );
      }
    }

    // Fallback: Traditional download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { success: true, method: "traditional-download", file: filename };
  };

  const getFileDescription = (mimeType) => {
    switch (mimeType) {
      case "text/html":
        return "HTML files";
      case "text/css":
        return "CSS files";
      case "text/javascript":
        return "JavaScript files";
      default:
        return "Files";
    }
  };

  const getFileExtension = (filename) => {
    return "." + filename.split(".").pop();
  };

  try {
    // Download HTML file with proper structure
    const completeHtml = createCompleteHtmlFile(html, css, js);
    const htmlResult = await downloadFile(
      completeHtml,
      "index.html",
      "text/html"
    );

    // Only continue if user didn't cancel
    if (htmlResult.cancelled) return { success: false, cancelled: true };

    // Download CSS file
    const cssResult = await downloadFile(
      css || "/* No CSS code */",
      "style.css",
      "text/css"
    );
    if (cssResult.cancelled) return { success: false, cancelled: true };

    // Download JS file
    const jsResult = await downloadFile(
      js || "// No JavaScript code",
      "script.js",
      "text/javascript"
    );
    if (jsResult.cancelled) return { success: false, cancelled: true };

    return {
      success: true,
      files: [htmlResult, cssResult, jsResult],
    };
  } catch (error) {
    console.error("Error downloading individual files:", error);
    throw new Error("Failed to download files: " + error.message);
  }
};
