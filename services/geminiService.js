import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const codeGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description:
        "The HTML code for the component. It should be a single string, containing only the body's content, without <html> or <body> tags.",
    },
    css: {
      type: Type.STRING,
      description:
        "The CSS code for styling the component. It should be a single string, without <style> tags.",
    },
    javascript: {
      type: Type.STRING,
      description:
        "The JavaScript code for the component's functionality. It should be a single string, without <script> tags.",
    },
  },
  required: ["html", "css", "javascript"],
};

export const formatCode = async (code) => {
  try {
    const fullPrompt = `
            You are an expert code formatter. Your task is to reformat the provided HTML, CSS, and JavaScript code to be clean, readable, and follow modern best practices and conventions (e.g., consistent indentation with 2 spaces, proper spacing, logical ordering).
            - Do not add, remove, or change any functionality, logic, or content.
            - Only correct the formatting.
            - Return the formatted code in the specified JSON structure.
            
            Here is the code to format:

            HTML:
            \`\`\`html
            ${code.html}
            \`\`\`

            CSS:
            \`\`\`css
            ${code.css}
            \`\`\`

            JavaScript:
            \`\`\`javascript
            ${code.javascript}
            \`\`\`
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: codeGenerationSchema,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      console.error("Gemini API returned an empty response for formatting.");
      return null;
    }

    const formattedCode = JSON.parse(jsonString);
    return formattedCode;
  } catch (error) {
    console.error("Error formatting code with Gemini API:", error);
    throw new Error(
      "Failed to communicate with the AI for formatting. Please try again."
    );
  }
};

export const generateCode = async (prompt) => {
  try {
    const fullPrompt = `
            Based on the following user request, generate the corresponding HTML, CSS, and JavaScript code.
            - The HTML should only contain elements that would go inside the <body> tag.
            - The CSS should be complete and ready to be placed inside a <style> tag.
            - The JavaScript should be functional and ready to be placed inside a <script> tag.
            - Ensure the code is clean, well-formatted, and directly implements the user's request.
            - Do not include markdown formatting like \`\`\`html in your response.
            
            User Request: "${prompt}"
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: codeGenerationSchema,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      console.error("Gemini API returned an empty response.");
      return null;
    }

    const generatedCode = JSON.parse(jsonString);
    return generatedCode;
  } catch (error) {
    console.error("Error generating code with Gemini API:", error);
    throw new Error(
      "Failed to communicate with the AI. Please check your API key and network connection."
    );
  }
};
