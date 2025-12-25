import React, { useState } from 'react';
import { Search, Loader2, BookOpen, Globe, Settings } from 'lucide-react';

// --- Define Types for the Data ---
interface Word {
    word: string;
    tamilOrigin: string;
    meaning: string;
    etymology: string;
    route: string;
}

interface AnalysisResult {
    words: Word[];
    error?: string;
}

export default function AdiTamil() {
    const [text, setText] = useState<string>('');
    const [analyzing, setAnalyzing] = useState<boolean>(false);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [selectedWord, setSelectedWord] = useState<Word | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const analyzeText = async () => {
        if (!text.trim()) return;

        if (!apiKey.trim()) {
            alert('Please add your Gemini API key in settings (top right gear icon)');
            setShowSettings(true);
            return;
        }

        setAnalyzing(true);
        setResults(null);
        setSelectedWord(null);

        try {
            // Using gemini-2.5-flash-exp (Experimental) as requested
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze this text and identify ALL words that have Tamil origins, including words that came through other languages (like Portuguese, Dutch, etc.): "${text}"

Return ONLY valid JSON (no markdown, no preamble).

Strict JSON format:
{
  "words": [
    {
      "word": "the word found in text",
      "tamilOrigin": "original Tamil word",
      "meaning": "meaning in Tamil",
      "etymology": "brief explanation",
      "route": "direct/via Portuguese/etc"
    }
  ]
}

Include common words like: catamaran (கட்டுமரம்), curry (கறி), mango (மாங்காய்), rice (அரிசி), cash (காசு), etc.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 8192,
                        responseMimeType: "application/json" // CRITICAL: Forces the AI to return strictly valid JSON
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'API Error');
            }

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('API returned empty candidates.');
            }

            // Since we are using strict JSON mode, we expect clean text immediately
            let textContent = data.candidates[0].content.parts[0].text || '';

            // Safety cleaning (just in case)
            const cleaned = textContent.replace(/```json|```/g, '').trim();

            if (!cleaned) {
                throw new Error('API returned empty text content.');
            }

            const parsed = JSON.parse(cleaned) as AnalysisResult;

            setResults(parsed);
        } catch (error: any) {
            console.error('Analysis error:', error);
            alert(`Error: ${error.message}.`);
            setResults({ words: [], error: 'Analysis failed. Try again!' });
        } finally {
            setAnalyzing(false);
        }
    };

    const escapeRegExp = (string: string): string => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const highlightText = () => {
        if (!results || !results.words || results.words.length === 0) {
            return <span>{text}</span>;
        }

        let highlightedText = text;
        const wordMap = new Map<string, Word & { index: number }>();

        results.words.forEach((item, idx) => {
            const safeWord = escapeRegExp(item.word);
            const regex = new RegExp(`\\b${safeWord}\\b`, 'gi');
            const placeholder = `__HIGHLIGHT_${idx}__`;
            wordMap.set(placeholder, { ...item, index: idx });
            highlightedText = highlightedText.replace(regex, placeholder);
        });

        const parts = highlightedText.split(/(__HIGHLIGHT_\d+__)/);

        return (
            <span>
                {parts.map((part, idx) => {
                    if (part.startsWith('__HIGHLIGHT_')) {
                        const wordData = wordMap.get(part);
                        return (
                            <span
                                key={idx}
                                onClick={() => setSelectedWord(wordData!)}
                                className="bg-amber-200 hover:bg-amber-300 cursor-pointer px-1 rounded border-b-2 border-amber-400 transition-colors"
                            >
                                {wordData!.word}
                            </span>
                        );
                    }
                    return <span key={idx}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="absolute right-0 top-0 p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-6 h-6" />
                    </button>

                    <h1 className="text-4xl font-bold text-orange-900 mb-2 flex items-center justify-center gap-2">
                        <BookOpen className="w-10 h-10" />
                        AdiTamil
                    </h1>
                    <p className="text-orange-700">ஆதி - Discover the Tamil roots in everyday language</p>
                    <p className="text-sm text-orange-600 mt-2"></p>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-orange-200">
                        <h3 className="text-lg font-bold text-orange-900 mb-3">⚙️ API Settings</h3>
                        
                        {/* FIX: Wrapped in <form> to resolve password field warning */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShowSettings(false);
                            }}
                            className="space-y-3"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Google Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                                    placeholder="Enter your Gemini API key"
                                    className="w-full p-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Get your free API key at: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Save & Close
                            </button>
                        </form>
                    </div>
                )}

                {/* Input Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <textarea
                        value={text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        placeholder="Enter text in English or Tamil... Try: 'I ate mango curry with rice and went on my catamaran boat'"
                        className="w-full h-32 p-4 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none resize-none"
                    />

                    <button
                        onClick={analyzeText}
                        disabled={analyzing || !text.trim()}
                        className="mt-4 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                Analyze Tamil Origins
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Highlighted Text */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Highlighted Text
                            </h2>
                            <div className="text-lg leading-relaxed text-gray-800">
                                {results.words && results.words.length > 0 ? (
                                    highlightText()
                                ) : (
                                    <p className="text-gray-500">No Tamil-origin words found in this text.</p>
                                )}
                            </div>
                            <p className="text-sm text-orange-600 mt-4">
                                Click on highlighted words to see their etymology →
                            </p>
                        </div>

                        {/* Etymology Panel */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-orange-900 mb-4">Etymology Details</h2>

                            {selectedWord ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-orange-700 mb-1">{selectedWord.word}</h3>
                                        <p className="text-sm text-gray-500 uppercase tracking-wide">{selectedWord.route}</p>
                                    </div>

                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <p className="text-sm text-orange-800 font-semibold mb-1">Tamil Origin:</p>
                                        <p className="text-xl text-orange-900">{selectedWord.tamilOrigin}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Meaning:</p>
                                        <p className="text-gray-800">{selectedWord.meaning}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Etymology:</p>
                                        <p className="text-gray-700 leading-relaxed">{selectedWord.etymology}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Select a highlighted word to see its Tamil etymology</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Found Words Summary */}
                {results && results.words && results.words.length > 0 && (
                    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-orange-900 mb-3">
                            Found {results.words.length} word{results.words.length !== 1 ? 's' : ''} with Tamil origins:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {results.words.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedWord(item)}
                                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-orange-900 rounded-full text-sm transition-colors"
                                >
                                    {item.word}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
