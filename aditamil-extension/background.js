const CONTEXT_MENU_ID = "aditamil-analyze-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Analyze with AdiTamil",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.selectionText) return;
  const apiKey = await getApiKey();
  if (!apiKey) {
    notify(tab.id, "Please save your Gemini API key in the popup first.");
    return;
  }
  const analysis = await analyzeText(info.selectionText, apiKey);
  chrome.tabs.sendMessage(tab.id, {
    type: "ADITAMIL_SHOW_RESULTS",
    payload: analysis
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADITAMIL_ANALYZE_TEXT") {
    handlePopupRequest(message.payload.text, sendResponse);
    return true; // keep port open
  }
});

async function handlePopupRequest(text, sendResponse) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    sendResponse({ error: "Please save your Gemini API key first." });
    return;
  }
  const result = await analyzeText(text, apiKey);
  sendResponse(result);
}

function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["adiTamilApiKey"], (data) => {
      resolve(data.adiTamilApiKey || "");
    });
  });
}

async function analyzeText(text, apiKey) {
  try {
    const prompt = buildPrompt(text);
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      const msg = await response.text();
      return { error: `Gemini error: ${response.status} ${msg}` };
    }

    const data = await response.json();
    const textResult =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No analysis returned.";
    const parsed = parseResult(textResult);
    return { results: parsed };
  } catch (err) {
    return { error: err?.message || "Failed to analyze text." };
  }
}

function buildPrompt(text) {
  return `
You are a Tamil etymology expert. Analyze the text and return a concise JSON array of objects with keys: word, etymology, confidence (Low/Medium/High). Focus on words with Tamil origins including routes via Sanskrit, Portuguese, Dutch, Arabic, etc.
Input text: """${text}"""
Format strictly as JSON array. Example:
[{"word":"catamaran","etymology":"From Tamil kattumaram ...","confidence":"High"}]
`;
}

function parseResult(text) {
  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) return [];
    const jsonSlice = text.slice(start, end + 1);
    const parsed = JSON.parse(jsonSlice);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function notify(tabId, message) {
  chrome.tabs.sendMessage(tabId, {
    type: "ADITAMIL_NOTIFY",
    payload: { message }
  });
}

