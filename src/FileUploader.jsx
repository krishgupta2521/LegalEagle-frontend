import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileUploader = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const summarizeText = async (inputText) => {
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const response = await fetch('http://localhost:5000/api/ai/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to get error message
                throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.summary) {
                setSummary(data.summary);
            } else {
                setSummary("No summary received from the server."); //Explicitly set a no summary message
            }

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'An unexpected error occurred during summarization.');
            setSummary(''); // Clear old summary on error
        } finally {
            setLoading(false);
        }
    };

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        setText('');  //Clear previous text and summary
        setSummary('');
        const reader = new FileReader();

        try {
            if (file.type === 'text/plain') {
                reader.onload = () => {
                    const extracted = reader.result;
                    setText(extracted);
                    summarizeText(extracted.slice(0, 8000)); // Trim to safe token range
                };
                reader.readAsText(file);
            } else if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                let extractedText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    extractedText += content.items.map(item => item.str).join(' ') + '\n';
                }
                setText(extractedText);
                summarizeText(extractedText.slice(0, 8000));
            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                setText(result.value);
                summarizeText(result.value.slice(0, 8000));
            } else {
                setError('Unsupported file type');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Error reading file');
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow-md">
            <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFile}
                className="mb-4"
            />
            {error && <div className="text-red-500 mt-2 p-2 bg-red-100 border border-red-400 rounded">{error}</div>}

            <h2 className="mt-4 font-semibold text-lg text-gray-800">Extracted Text</h2>
            <textarea
                value={text}
                readOnly
                rows={10}
                className="w-full mt-2 border rounded p-2 bg-gray-50 text-gray-700"
                placeholder="Extracted text will appear here..."
            />

            <h2 className="mt-6 font-semibold text-lg text-gray-800">AI Summary</h2>
            <textarea
                value={loading ? 'Summarizing...' : summary}
                readOnly
                rows={10}
                className="w-full mt-2 border rounded p-2 bg-gray-50 text-gray-700"
                placeholder="AI summary will appear here..."
            />
        </div>
    );
};

export default FileUploader;
