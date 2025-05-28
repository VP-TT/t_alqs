import React, { useState, useCallback, useEffect } from 'react';
import { FileUp, Search, X } from 'lucide-react';
import axios from 'axios';

const QuestionAnswering = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [answer, setAnswer] = useState('');
  const [context, setContext] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Setup PDF.js worker on component mount
  useEffect(() => {
    const setupPDFWorker = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        
        // Method 1: Use CDN with correct version
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        
        // Alternative Method 2: Use local worker (uncomment if you prefer local setup)
        // pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        //   'pdfjs-dist/build/pdf.worker.min.mjs',
        //   import.meta.url,
        // ).toString();
        
        console.log('PDF.js worker configured successfully');
      } catch (error) {
        console.error('Failed to setup PDF.js worker:', error);
        setError('Failed to initialize PDF reader. Please refresh the page.');
      }
    };

    setupPDFWorker();
  }, []);

  // File handling functions
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF or TXT file');
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  }, []);

  // Updated file content reader with better error handling
  const readFileContent = async (file) => {
    return new Promise(async (resolve, reject) => {
      if (file.type === 'application/pdf') {
        try {
          const pdfjsLib = await import('pdfjs-dist');
          
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const typedArray = new Uint8Array(e.target?.result);
              
              // Load PDF document
              const loadingTask = pdfjsLib.getDocument({
                data: typedArray,
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
                cMapPacked: true,
              });
              
              const pdf = await loadingTask.promise;
              let textContent = '';
              
              // Extract text from all pages
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items
                  .filter(item => 'str' in item)
                  .map(item => item.str)
                  .join(' ');
                textContent += pageText + ' ';
              }
              
              if (textContent.trim().length === 0) {
                reject(new Error('No text content found in PDF'));
              } else {
                resolve(textContent.trim());
              }
            } catch (err) {
              console.error('PDF parsing error:', err);
              reject(new Error('Failed to read PDF content. The file may be corrupted or password-protected.'));
            }
          };
          
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsArrayBuffer(file);
        } catch (err) {
          reject(new Error('PDF.js library failed to load'));
        }
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result);
        reader.onerror = () => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setAnswer('');
    setContext('');
    
    try {
      if (!file) {
        throw new Error('Please upload a document');
      }
      
      if (!question.trim()) {
        throw new Error('Please enter a question');
      }

      // Read file content
      const textContent = await readFileContent(file);
      
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('Could not extract text from the document');
      }

      // Make API call to Flask backend
      const response = await axios.post('http://localhost:5001/ask', {
        text: textContent,
        question: question.trim()
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.answer) {
        setAnswer(response.data.answer);
        setContext(response.data.context || '');
      } else {
        throw new Error('No answer received from the model');
      }

    } catch (err) {
      console.error('Q&A Error:', err);
      
      if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to the server. Please make sure the Flask app is running on port 5001.');
      } else if (err.response?.status === 503) {
        setError('Question answering model is not available. Please check server logs.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setQuestion('');
    setAnswer('');
    setContext('');
    setError('');
  };

  return (
    <section id="question-answering" className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Document Q&A</h1>
          <p className="text-lg text-gray-700">
            Upload your document and ask specific questions to get AI-powered answers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Section */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 mb-2">
              Drag and drop your file here, or{' '}
              <label className="text-green-600 hover:text-green-700 cursor-pointer underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">Supports PDF and TXT files (max 10MB)</p>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                <span>📄 {file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask your question
            </label>
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your legal question here..."
                disabled={isProcessing}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isProcessing || !file || !question.trim()}
              className={`flex-1 py-3 px-6 rounded-md text-white font-medium transition-colors ${
                isProcessing || !file || !question.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Get Answer'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Answer Output */}
        {answer && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Answer</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-800 text-lg leading-relaxed">{answer}</p>
            </div>
            {context && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Relevant Context:</span> 
                  <span className="ml-2 italic">{context}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestionAnswering;
