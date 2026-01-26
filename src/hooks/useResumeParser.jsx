import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";

import { useState, useCallback } from "react";

export function useResumeParser() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanText = (str) => {
    if (!str) return "";

    return str
      .replace(/\s+/g, " ") // collapse multiple spaces/newlines/tabs
      .replace(/[^\x20-\x7E]+/g, "") // remove non-ASCII junk characters
      .trim();
  };

  const validateParsedText = (fullText, source) => {
    if (!fullText || fullText.length < 20) {
      setError(
        `No readable text found in your ${source}. It may be a scanned or image-only resume. Please upload a text-based resume.`
      );
      return null;
    }
    return fullText;
  };

  const parseFile = useCallback(async (file) => {
    setError("");
    setText("");
    setIsLoading(true);

    try {
      // ✔ 1. Check file presence
      if (!file) {
        throw new Error("No file provided.");
      }

      // ✔ 2. Validate type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          "Unsupported file type. Only PDF, DOCX, and TXT are allowed. Please upload a valid file."
        );
        return;
      }

      // ✔ 3. Validate size
      const MAX_SIZE = 8 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError("File is too large. Maximum allowed size is 8MB.");
        return;
      }

      // Handle TXT files (no ArrayBuffer needed)
      if (file.type === "text/plain") {
        try {
          let fullText = await file.text();

          // Normalize whitespace
          fullText = fullText.replace(/\s+/g, " ").trim();

          // Clean text
          fullText = cleanText(fullText);

          // Validate
          const result = validateParsedText(fullText, "file");
          if (result) {
            setText(result);
            return result;
          }
          return;
        } catch (err) {
          console.error(err);
          setError("Failed to parse TXT file. File may be corrupted.");
          return;
        }
      }

      // ✔ 4. Convert to ArrayBuffer for PDF/DOCX
      let buffer;
      try {
        buffer = await file.arrayBuffer();
      } catch {
        setError("Failed to read file data. Please upload a valid file.");
        return;
      }

      // ✔ 5. Parse PDF
      if (file.type === "application/pdf") {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.mjs",
            import.meta.url
          ).toString();

          const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const pageText = content.items.map((item) => item.str).join(" ");

            fullText += " " + pageText;
          }

          // Normalize whitespace
          fullText = fullText.replace(/\s+/g, " ").trim();

          // Clean text
          fullText = cleanText(fullText);

          // Validate
          const result = validateParsedText(fullText, "PDF");
          if (result) {
            setText(result);
            return result;
          }
          return;
        } catch (err) {
          console.error(err);
          setError("Failed to parse PDF. File may be corrupted.");
          return;
        }
      }

      // ✔ 6. Parse DOCX
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: buffer });

          let fullText = result.value || "";

          // Normalize whitespace
          fullText = fullText.replace(/\s+/g, " ").trim();

          // Clean text
          fullText = cleanText(fullText);

          // Validate
          const validated = validateParsedText(fullText, "DOCX");
          if (validated) {
            setText(validated);
            return validated;
          }
          return;
        } catch (err) {
          console.error(err);
          setError("Failed to parse DOCX. File may be corrupted.");
          return;
        }
      }
    } catch (err) {
      setError("Unexpected error parsing file. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    parseFile,
    text,
    error,
    isLoading,
  };
}
