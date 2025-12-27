import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";

import { useState, useCallback } from "react";

export function useResumeParser() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Core function (logic added in next tickets)

  const cleanText = (str) => {
    if (!str) return "";

    return str
      .replace(/\s+/g, " ") // collapse multiple spaces/newlines/tabs
      .replace(/[^\x20-\x7E]+/g, "") // remove non-ASCII junk characters
      .trim();
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
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          "Unsupported file type. Only PDF and DOCX are allowed.please upload a valid file."
        );
        return;
      }

      // ✔ 3. Validate size
      const MAX_SIZE = 8 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError("File is too large. Maximum allowed size is 8MB.");
        return;
      }
      // ✔ 4. Convert to ArrayBuffer
      let buffer;
      try {
        buffer = await file.arrayBuffer();
      } catch (err) {
        setError("Failed to read file data. Please upload a valid file.", err.message);
        return;
      }

      // Placeholder for PDF or DOCX parsing (next tickets)
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

          // normalize whitespace
          fullText = fullText.replace(/\s+/g, " ").trim();

          fullText = cleanText(fullText);
          fullText = cleanText(fullText);

          if (!fullText || fullText.length < 20) {
            setError(
              "No readable text found in your file. It may be a scanned or image-only resume. Please upload a text-based PDF or DOCX."
            );
            return;
          }

          setText(fullText);

          setText(fullText);
          return fullText;
        } catch (err) {
          console.error(err);
          setError("Failed to parse PDF. File may be corrupted.");
          return;
        }
      }
      // 6. If DOCX → parse using mammoth
      else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: buffer });

          let fullText = result.value || "";

          // normalize whitespace
          fullText = fullText.replace(/\s+/g, " ").trim();

          fullText = cleanText(fullText);
          fullText = cleanText(fullText);

          if (!fullText || fullText.length < 20) {
            setError(
              "No readable text found in your file. It may be a scanned or image-only resume. Please upload a text-based PDF or DOCX."
            );
            return;
          }

          setText(fullText);

          setText(fullText);
          return fullText;
        } catch (err) {
          console.error(err);
          setError("Failed to parse DOCX. File may be corrupted.");
          return;
        }
      }
    } catch (err) {
      setError("Unexpected error parsing file.", err.message);
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
