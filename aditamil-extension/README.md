# AdiTamil Browser Extension

> Discover Tamil etymology on any webpage! Select text, right-click, and explore Tamil origins instantly.

A powerful browser extension that analyzes text on any webpage and identifies words with Tamil origins, powered by Google Gemini AI.

## ✨ Features

- 🌐 **Works on Any Website** - Analyze text on any webpage
- 🖱️ **Right-Click Menu** - Select text and choose "Analyze with AdiTamil"
- 💡 **Smart Detection** - Finds Tamil-origin words including those via Portuguese, Dutch, Arabic, etc.
- 📖 **Detailed Etymology** - Click words to see full etymology, meaning, and linguistic route
- 🎨 **Beautiful UI** - Clean, modern slide-in panel with Tamil-inspired design
- 🆓 **Free API** - Powered by Google Gemini's generous free tier
- ⚡ **Fast & Lightweight** - Minimal performance impact

## 📦 Installation

### For Chrome/Edge/Brave

1. **Download the extension files**
   - Clone or download this repository
   - Or download the ZIP and extract it
2. **Get your free Gemini API key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key
3. **Load the extension**
   - Open Chrome/Edge/Brave
   - Go to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `aditamil-extension` folder
   - The AdiTamil icon should appear in your toolbar!
4. **Configure API key**
   - Click the AdiTamil extension icon
   - Paste your Gemini API key
   - Click "Save API Key"
   - You're ready to go! 🎉

### For Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file
4. Configure API key as above

## 🚀 Usage

### Method 1: Context Menu (Recommended)
1. Select any text on a webpage
2. Right-click and choose **"Analyze with AdiTamil"**
3. A panel slides in showing Tamil-origin words
4. Click any word card to expand etymology details

### Method 2: Quick Analysis (In Popup)
1. Click the AdiTamil extension icon
2. Type or paste text in the "Quick Analysis" box
3. Click "Analyze"
4. Results appear instantly in the popup

## 📁 File Structure

```
aditamil-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.js               # Popup functionality
├── background.js          # Service worker (context menu, API calls)
├── content.js             # Injected script (results panel)
├── content.css            # Styles for injected elements
├── icons/
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md              # This file
```

## 🎨 Creating Icons

You need three icon sizes. Here's how to create them:

### Option 1: Using an online tool
1. Go to [favicon.io](https://favicon.io/favicon-generator/)
2. Create an icon with:
   - Text: "ஆ" or "📖"
   - Background: Orange (#ea580c)
   - Font: Bold
3. Download and rename to `icon16.png`, `icon48.png`, `icon128.png`

### Option 2: Using design software
Create PNG files with these specs:
- **icon16.png** - 16x16 pixels
- **icon48.png** - 48x48 pixels  
- **icon128.png** - 128x128 pixels

Design suggestion:
- Orange background (#ea580c)
- White Tamil letter "ஆ" or book emoji 📖
- Simple, recognizable at small sizes

## 🔧 Configuration

### API Settings
The extension uses Google Gemini with these defaults:
- Model: `gemini-1.5-flash`
- Temperature: `0.7`
- Max tokens: `2048`

### Customizing
You can modify the analysis prompt in `background.js`:

```javascript
// Line ~40 in background.js
text: `Your custom prompt here...`
```

## 🆓 API Usage & Limits

Google Gemini free tier provides:
- **15 requests per minute**
- **1 million tokens per day**
- **1,500 requests per day**

This is more than enough for personal use!

## 🛠️ Development

### Testing locally
1. Make changes to any file
2. Go to `chrome://extensions/`
3. Click the refresh icon on AdiTamil
4. Test your changes

### Debugging
- **Popup**: Right-click popup → Inspect
- **Background**: Extensions page → AdiTamil → "service worker" link
- **Content script**: Open DevTools on any page, check Console

### Adding features
Ideas for contributions:
- [ ] Support for more languages (Telugu, Malayalam)
- [ ] Export results as PDF/JSON
- [ ] Keyboard shortcuts
- [ ] Word favorites/history
- [ ] Pronunciation guides
- [ ] Dark mode

## 🐛 Troubleshooting

### Extension doesn't load
- Ensure all files are in the folder
- Check that manifest.json is valid JSON
- Look for errors in chrome://extensions/

### "Invalid API key" error
- Verify your Gemini API key is correct
- Check it hasn't expired
- Ensure you have internet connection

### No results showing
- Check if you've exceeded rate limits (15/min)
- Try shorter text selections
- Check browser console for errors

### Panel doesn't appear
- Check if content.js is loading (DevTools → Sources)
- Verify the page allows content scripts
- Try refreshing the page

## 📄 Permissions Explained

The extension requires these permissions:

- **activeTab** - To read selected text on current page
- **storage** - To save your API key securely
- **contextMenus** - To add right-click menu option
- **host_permissions** - To call Google Gemini API

We don't collect or store any data beyond your API key (stored locally).

## 🔒 Privacy

- Your API key is stored locally in your browser
- Text is sent only to Google Gemini for analysis
- No data is collected by AdiTamil
- Analysis happens in real-time, nothing is saved

## 📝 License

MIT License - Free to use, modify, and distribute!

## 🙏 Credits

- **Google Gemini** - For free AI API
- **Tamil Language Community** - For preserving etymology
- **You** - For using and supporting AdiTamil!

## 🔗 Links

- [Google AI Studio](https://aistudio.google.com/) - Get API key
- [Gemini API Docs](https://ai.google.dev/docs) - API documentation
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/) - For developers

## 📧 Support

Found a bug? Have suggestions?
- Open an issue on GitHub
- Submit a pull request
- Contact the developer

---

**AdiTamil Extension** - Bringing Tamil etymology to every webpage! 🇮🇳

Made with ❤️ for Tamil language enthusiasts

