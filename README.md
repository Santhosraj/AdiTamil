# AdiTamil (ஆதி)

> Discover the Tamil roots in everyday language

AdiTamil is an AI-powered etymology analyzer that identifies and explains words with Tamil origins in any text. Whether words came directly from Tamil or traveled through other languages like Portuguese, Dutch, or Arabic, AdiTamil traces their linguistic journey back to their Tamil roots.

![AdiTamil Banner](https://img.shields.io/badge/Language-Tamil-orange) ![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue) ![License](https://img.shields.io/badge/Apache2.0-license-green)

## ✨ Features

- 🔍 **Smart Word Detection** - Identifies Tamil-origin words in English and Tamil text
- 🌍 **Multi-Route Etymology** - Traces words that came through Portuguese, Dutch, Arabic, and other languages
- 💡 **Interactive Highlighting** - Click highlighted words to see detailed etymology
- 🎨 **Beautiful UI** - Clean, modern interface with Tamil cultural design elements
- 🆓 **Free API** - Powered by Google Gemini's free tier
- ⚡ **Fast & Accurate** - AI-powered analysis with comprehensive results

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/aditamil.git
cd aditamil
```

2. **Install dependencies**
```bash
npm install
```

3. **Get your free Gemini API key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

4. **Run the application**
```bash
npm start
```

5. **Configure API key**
   - Click the settings icon (⚙️) in the top right
   - Paste your Gemini API key
   - Click "Save & Close"

6. **Start analyzing!**
   - Enter text in English or Tamil
   - Click "Analyze Tamil Origins"
   - Click highlighted words to see their etymology

## 📖 Usage Examples

### Example 1: English Text
```
Input: "I ate mango curry with rice and went on my catamaran boat"

Results:
- mango → மாங்காய் (māṅkāy) - via Portuguese
- curry → கறி (kaṟi) - via Portuguese  
- rice → அரிசி (arici) - via various routes
- catamaran → கட்டுமரம் (kaṭṭumaram) - direct Tamil
```

### Example 2: Mixed Text
```
Input: "The cash I paid for betel was kept in a coffer"

Results:
- cash → காசு (kācu) - via Portuguese
- betel → வெற்றிலை (veṟṟilai) - via Portuguese
- coffer → கபரி (kapari) - via Arabic/Tamil
```

## 🏗️ Project Structure

```
aditamil/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main AdiTamil component
│   ├── index.js            # Entry point
│   ├── index.css           # Global styles
│   └── App.css             # Component styles
├── package.json
└── README.md
```

## 🔧 Configuration

### API Settings

The app uses Google Gemini API with the following configuration:

- **Model**: `gemini-3-flash-preview`
- **Temperature**: 0.7
- **Max Tokens**: 2048

You can modify these in `App.js`:

```javascript
generationConfig: {
  temperature: 0.7,        // Adjust for more/less creative responses
  maxOutputTokens: 2048,   // Increase for longer texts
}
```

## 🎨 Customization

### Colors

The app uses an orange/saffron theme reflecting Tamil culture. To customize:

```javascript
// In App.js, modify Tailwind classes:
className="bg-orange-600"  // Primary color
className="bg-amber-200"   // Highlight color
```

### Branding

Update the header section:

```javascript
<h1 className="text-4xl font-bold text-orange-900 mb-2">
  AdiTamil
</h1>
<p className="text-orange-700">Your custom tagline here</p>
```

## 🤖 How It Works

1. **Input Processing**: User enters text in the textarea
2. **API Call**: Text is sent to Google Gemini with a specialized prompt
3. **AI Analysis**: Gemini identifies Tamil-origin words using linguistic knowledge
4. **JSON Parsing**: Response is parsed into structured data
5. **Highlighting**: Words are highlighted in the original text
6. **Interactive Display**: Users click words to see detailed etymology


## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (one-way operation)
npm run eject
```

### Adding Features

Want to contribute? Here are some ideas:

- [ ] Add export functionality (PDF, JSON)
- [ ] Create a word history/favorites feature
- [ ] Add pronunciation guides
- [ ] Support more languages (Telugu, Malayalam, etc.)
- [ ] Create browser extension version
- [ ] Add offline mode with word database

## 🐛 Troubleshooting

### "API Error" Message
- Check your API key is correct
- Verify you haven't exceeded free tier limits
- Check your internet connection

### No Words Found
- Try text with common Tamil-origin words (mango, curry, rice)
- Ensure text is in English or Tamil
- Check the AI response in browser console

### Slow Response
- Gemini free tier has rate limits
- Try shorter text passages
- Wait a few seconds between requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes!

## 🙏 Acknowledgments
- **Tamil Language Community** - For preserving linguistic heritage

## 🔗 Links

- [Google AI Studio](https://aistudio.google.com/) - Get your API key
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tamil Etymology Resources](https://en.wikipedia.org/wiki/List_of_English_words_of_Dravidian_origin)

## 📧 Contact

Have questions or suggestions? Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Reach out via email

---

**AdiTamil** - ஆதி (Origin) - Bringing Tamil etymology to everyone 🇮🇳

Made with ❤️ for Tamil language enthusiasts
