"""
AdiTamil MCP Server
An AI-powered MCP server that analyzes text for Tamil-origin words using Google Gemini

Installation:
pip install mcp google-generativeai

Usage:
python aditamil_mcp.py

Add to Claude Desktop config:
Mac/Linux: ~/.config/claude/claude_desktop_config.json
Windows: %APPDATA%/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "aditamil": {
      "command": "python",
      "args": ["/path/to/aditamil_mcp.py"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key-here"
      }
    }
  }
}

Get your free Gemini API key at: https://aistudio.google.com/app/apikey
"""

import asyncio
import json
import os
import sys
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Install: pip install google-generativeai
try:
    import google.generativeai as genai
except ImportError:
    print("Please install: pip install google-generativeai", file=sys.stderr)
    sys.exit(1)


class AdiTamilServer:
    def __init__(self):
        self.server = Server("aditamil")
        
        # Configure Gemini API
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("ERROR: GEMINI_API_KEY environment variable not set", file=sys.stderr)
            print("Get your free API key at: https://aistudio.google.com/app/apikey", file=sys.stderr)
            sys.exit(1)
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3-flash-preview')
        
        # Register handlers
        self.server.list_tools()(self.list_tools)
        self.server.call_tool()(self.call_tool)
    
    async def list_tools(self) -> list[Tool]:
        """List available tools"""
        return [
            Tool(
                name="analyze_tamil_etymology",
                description=(
                    "Analyzes text (English or Tamil) to identify words with Tamil origins. "
                    "Returns detailed etymology including the original Tamil word (in Tamil script), "
                    "meaning, and the linguistic route (direct or via Portuguese/Dutch/Arabic/etc). "
                    "Perfect for discovering Tamil influence in everyday language."
                ),
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "The text to analyze for Tamil-origin words (English or Tamil)"
                        }
                    },
                    "required": ["text"]
                }
            ),
            Tool(
                name="lookup_word_etymology",
                description=(
                    "Looks up the Tamil etymology of a specific word. "
                    "Returns comprehensive information about its Tamil origin, romanization, "
                    "meaning, linguistic journey, first recorded use, related words, and usage examples. "
                    "Use this for deep dives into individual words."
                ),
                inputSchema={
                    "type": "object",
                    "properties": {
                        "word": {
                            "type": "string",
                            "description": "The specific word to look up (e.g., 'catamaran', 'curry', 'mango')"
                        }
                    },
                    "required": ["word"]
                }
            ),
            Tool(
                name="batch_analyze_texts",
                description=(
                    "Analyzes multiple texts for Tamil-origin words in a single batch operation. "
                    "More efficient than calling analyze_tamil_etymology multiple times. "
                    "Useful for processing multiple sentences, paragraphs, or documents."
                ),
                inputSchema={
                    "type": "object",
                    "properties": {
                        "texts": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Array of texts to analyze (each can be a sentence or paragraph)"
                        }
                    },
                    "required": ["texts"]
                }
            ),
            Tool(
                name="find_tamil_words_by_route",
                description=(
                    "Finds Tamil-origin words in text that came through a specific linguistic route. "
                    "Useful for exploring how Tamil words entered English through different languages "
                    "like Portuguese, Dutch, Arabic, etc. Great for linguistic research."
                ),
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "The text to analyze"
                        },
                        "route": {
                            "type": "string",
                            "description": "The linguistic route to filter by (e.g., 'Portuguese', 'Dutch', 'Arabic', 'direct')"
                        }
                    },
                    "required": ["text", "route"]
                }
            )
        ]
    
    async def call_tool(self, name: str, arguments: Any) -> list[TextContent]:
        """Handle tool calls"""
        try:
            if name == "analyze_tamil_etymology":
                return await self.analyze_tamil_etymology(arguments["text"])
            
            elif name == "lookup_word_etymology":
                return await self.lookup_word_etymology(arguments["word"])
            
            elif name == "batch_analyze_texts":
                return await self.batch_analyze_texts(arguments["texts"])
            
            elif name == "find_tamil_words_by_route":
                return await self.find_tamil_words_by_route(
                    arguments["text"], 
                    arguments["route"]
                )
            
            else:
                return [TextContent(
                    type="text",
                    text=f"Unknown tool: {name}"
                )]
        
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"Error: {str(e)}\n\nTroubleshooting:\n- Check your GEMINI_API_KEY is valid\n- Verify you haven't exceeded free tier limits (15 req/min)\n- Ensure text is not empty"
            )]
    
    async def analyze_tamil_etymology(self, text: str) -> list[TextContent]:
        """Analyze text for Tamil-origin words"""
        
        prompt = f"""Analyze this text and identify ALL words that have Tamil origins, including words that came through other languages (like Portuguese, Dutch, Arabic, etc.): "{text}"

Return ONLY valid JSON (no markdown, no preamble, no explanation) in this exact format:
{{
  "original_text": "{text}",
  "words_found": [
    {{
      "word": "the word found in text",
      "tamilOrigin": "original Tamil word in Tamil script",
      "tamilRomanized": "romanized Tamil word (e.g., kaṭṭumaram)",
      "meaning": "meaning in Tamil/English",
      "etymology": "detailed explanation of how it entered the language",
      "route": "direct/via Portuguese/via Dutch/via Arabic/etc",
      "firstRecordedUse": "approximate time period if known"
    }}
  ],
  "summary": "brief summary of findings (2-3 sentences)"
}}

Be thorough - include common words like: catamaran (கட்டுமரம்), curry (கறி), mango (மாங்காய்), rice (அரிசி), cash (காசு), cheroot (சுருட்டு), betel (வெற்றிலை), etc."""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2048,
            )
        )
        
        # Clean and parse JSON
        response_text = response.text
        cleaned = response_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        
        # Format the response nicely
        formatted_response = self._format_etymology_results(result)
        
        return [TextContent(
            type="text",
            text=formatted_response
        )]
    
    async def lookup_word_etymology(self, word: str) -> list[TextContent]:
        """Look up etymology of a specific word"""
        
        prompt = f"""Provide detailed Tamil etymology for the word "{word}".

Return ONLY valid JSON (no markdown, no preamble):
{{
  "word": "{word}",
  "hasTamilOrigin": true/false,
  "tamilOrigin": "original Tamil word in Tamil script",
  "tamilRomanized": "romanized Tamil word with diacritics",
  "meaning": "detailed meaning in Tamil and English",
  "etymology": "comprehensive etymology explanation (3-5 sentences)",
  "route": "linguistic route (direct/via Portuguese/Dutch/Arabic/etc)",
  "firstRecordedUse": "time period (e.g., '16th century')",
  "relatedWords": ["list", "of", "related", "words"],
  "examples": ["example usage 1", "example usage 2"],
  "culturalContext": "cultural significance if any"
}}

If the word does not have Tamil origin, set hasTamilOrigin to false and provide explanation."""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=1500,
            )
        )
        
        response_text = response.text
        cleaned = response_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        
        formatted_response = self._format_word_lookup(result)
        
        return [TextContent(
            type="text",
            text=formatted_response
        )]
    
    async def batch_analyze_texts(self, texts: list[str]) -> list[TextContent]:
        """Analyze multiple texts in batch"""
        
        results = []
        for i, text in enumerate(texts, 1):
            result = await self.analyze_tamil_etymology(text)
            results.append(f"{'='*60}\nTEXT {i}/{len(texts)}\n{'='*60}\n{result[0].text}\n")
        
        summary = f"\n{'='*60}\nBATCH SUMMARY\n{'='*60}\nAnalyzed {len(texts)} text(s) for Tamil-origin words.\n"
        
        return [TextContent(
            type="text",
            text="\n".join(results) + summary
        )]
    
    async def find_tamil_words_by_route(self, text: str, route: str) -> list[TextContent]:
        """Find Tamil words by specific linguistic route"""
        
        prompt = f"""Analyze this text and identify ONLY words with Tamil origins that came through "{route}": "{text}"

Return ONLY valid JSON:
{{
  "route": "{route}",
  "original_text": "{text}",
  "words_found": [
    {{
      "word": "word",
      "tamilOrigin": "Tamil script",
      "tamilRomanized": "romanized",
      "meaning": "meaning",
      "etymology": "explanation"
    }}
  ],
  "summary": "summary focusing on this specific route"
}}"""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=1500,
            )
        )
        
        response_text = response.text
        cleaned = response_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        
        output = []
        output.append(f"🔍 TAMIL WORDS VIA {route.upper()}")
        output.append(f"Original text: {text}\n")
        
        words = result.get('words_found', [])
        if not words:
            output.append(f"❌ No Tamil-origin words found via {route} in this text.")
        else:
            output.append(f"✅ Found {len(words)} word(s) with Tamil origins via {route}:\n")
            
            for i, word in enumerate(words, 1):
                output.append(f"{i}. **{word['word']}**")
                output.append(f"   Tamil: {word['tamilOrigin']} ({word.get('tamilRomanized', '')})")
                output.append(f"   Meaning: {word['meaning']}")
                output.append(f"   Etymology: {word['etymology']}\n")
        
        if result.get('summary'):
            output.append(f"📊 {result['summary']}")
        
        return [TextContent(
            type="text",
            text="\n".join(output)
        )]
    
    def _format_etymology_results(self, result: dict) -> str:
        """Format etymology analysis results"""
        output = []
        output.append(f"📝 ADITAMIL ETYMOLOGY ANALYSIS (ஆதி)")
        output.append(f"Original text: {result.get('original_text', '')}\n")
        
        words = result.get('words_found', [])
        if not words:
            output.append("❌ No Tamil-origin words found in this text.")
        else:
            output.append(f"✅ Found {len(words)} word(s) with Tamil origins:\n")
            
            for i, word in enumerate(words, 1):
                output.append(f"{i}. **{word['word']}**")
                output.append(f"   Tamil Origin: {word['tamilOrigin']} ({word.get('tamilRomanized', '')})")
                output.append(f"   Meaning: {word['meaning']}")
                output.append(f"   Route: {word['route']}")
                output.append(f"   Etymology: {word['etymology']}")
                if word.get('firstRecordedUse'):
                    output.append(f"   First recorded: {word['firstRecordedUse']}")
                output.append("")
        
        if result.get('summary'):
            output.append(f"📊 Summary: {result['summary']}")
        
        return "\n".join(output)
    
    def _format_word_lookup(self, result: dict) -> str:
        """Format word lookup results"""
        output = []
        output.append(f"🔍 ADITAMIL WORD LOOKUP: {result['word']}\n")
        
        if not result.get('hasTamilOrigin'):
            output.append(f"❌ '{result['word']}' does not appear to have Tamil origin.")
            if result.get('etymology'):
                output.append(f"\n{result['etymology']}")
        else:
            output.append(f"✅ Tamil Origin Confirmed\n")
            output.append(f"Tamil Word: {result['tamilOrigin']} ({result.get('tamilRomanized', '')})")
            output.append(f"Meaning: {result['meaning']}")
            output.append(f"Route: {result['route']}")
            output.append(f"\nEtymology:\n{result['etymology']}")
            
            if result.get('firstRecordedUse'):
                output.append(f"\nFirst Recorded: {result['firstRecordedUse']}")
            
            if result.get('culturalContext'):
                output.append(f"\nCultural Context:\n{result['culturalContext']}")
            
            if result.get('relatedWords'):
                output.append(f"\nRelated Words: {', '.join(result['relatedWords'])}")
            
            if result.get('examples'):
                output.append("\nExamples:")
                for example in result['examples']:
                    output.append(f"  • {example}")
        
        return "\n".join(output)
    
    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                self.server.create_initialization_options()
            )


async def main():
    """Main entry point"""
    print("🚀 Starting AdiTamil MCP Server...", file=sys.stderr)
    server = AdiTamilServer()
    await server.run()


if __name__ == "__main__":
    asyncio.run(main())