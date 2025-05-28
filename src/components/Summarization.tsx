import React, { useState, useCallback } from 'react';
import { FileUp, Download, X } from 'lucide-react';
import axios from 'axios';  // Make sure to install axios
import workerSrc from 'pdfjs-dist/build/pdf.worker?worker&url';
import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


const Summarization = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  // Add file reading functionality
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf') {
        // For PDF files, you'll need a PDF parsing library
        // This is a simplified example
        import('pdfjs-dist').then(pdfjsLib => {
          const reader = new FileReader();
          reader.onload = async (e: ProgressEvent<FileReader>) => {
            try {
              if (e.target && e.target.result) {
                const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
                const loadingTask = pdfjsLib.getDocument(typedArray);
                const pdf = await loadingTask.promise;
                
                let textContent = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const content = await page.getTextContent();
                  textContent += content.items.map(item => {
                    // Check if the item has a 'str' property
                    return 'str' in item ? item.str : '';
                  }).join(' ');
                }
                resolve(textContent);
              } else {
                reject(new Error('Failed to read PDF file'));
              }
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && e.target.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to read text file'));
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    
    try {
      let textToSummarize: string = text;
      
      // If a file was uploaded, read its content
      if (file) {
        textToSummarize = await readFileContent(file);
      }
      
      if (!textToSummarize) {
        throw new Error('No text to summarize');
      }
      
      // Call your backend API
      const response = await axios.post('http://localhost:5001/summarize', {
        text: textToSummarize
      });
      
      setSummary(response.data.summary);
    } catch (err: unknown) {
      console.error('Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate summary');
      }
      setSummary('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="summarization" className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Document Summarization</h1>
          <p className="text-lg text-gray-700">
            Upload your legal document or paste text to get an AI-powered summary
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Section */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 mb-2">
              Drag and drop your file here, or{' '}
              <label className="text-green-600 hover:text-green-700 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">Supports PDF and TXT files</p>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Text Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or paste your text here
            </label>
            <textarea
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              className="w-full h-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Paste your text here..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || (!file && !text)}
            className={`w-full py-3 px-6 rounded-md text-white font-medium ${
              isProcessing || (!file && !text)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Generate Summary'}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Summary Output */}
        {summary && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 text-green-600 hover:text-green-700"
              >
                <Download size={20} />
                Download
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Summarization;
