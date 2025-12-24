# AdiTamil MCP Server

An AI-powered MCP server that analyzes text for Tamil-origin words using Google Gemini.

---

## 📦 Installation

```bash
pip install mcp google-generativeai
```

---

## 🚀 Usage

Run the MCP server:

```bash
python aditamil_mcp.py
```

---

## ⚙️ Configuration

Add to your Claude Desktop config file:

### Config File Locations

- **Mac/Linux**: `~/.config/claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

### Configuration Example

```json
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
```

---

## 🔑 API Key

Get your free Gemini API key at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## 📝 Example

Once configured, Claude can use the AdiTamil MCP server to analyze Tamil etymology in any conversation:

```
User: "Analyze this text for Tamil words: I love teak furniture and betel leaves"

Claude: [Uses aditamil MCP] 
Found Tamil-origin words:
- teak ← Tamil தேக்கு (thēkku)
- betel ← Tamil வெற்றிலை (veṟṟilai)
```

---

## 🛠️ Troubleshooting

### Server not connecting
- Verify the path in `args` is absolute
- Check Python is in your PATH
- Ensure `GEMINI_API_KEY` is set correctly

### Import errors
- Reinstall dependencies: `pip install --upgrade mcp google-generativeai`

### API key issues
- Verify your key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Check for extra spaces in the config file

---

## 📚 Features

- ✅ Real-time Tamil etymology analysis
- ✅ Batch text processing
- ✅ Word-specific lookups
- ✅ Linguistic route tracking (Portuguese, Dutch, Arabic, etc.)
- ✅ Integration with Claude and other AI assistants

---

## 🤝 Contributing

Contributions welcome! Open an issue or submit a PR.

---

## 📄 License

Apache 2.0 - See LICENSE file for details
