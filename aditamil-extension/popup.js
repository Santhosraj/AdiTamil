const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const clearKeyBtn = document.getElementById("clearKeyBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const quickText = document.getElementById("quickText");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const keyStatus = document.getElementById("keyStatus");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#f87171" : "#9ca3af";
}

function renderResults(entries) {
  resultsEl.innerHTML = "";
  if (!entries || !entries.length) {
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "No Tamil-origin words detected yet.";
    resultsEl.appendChild(hint);
    return;
  }

  entries.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="row" style="margin-bottom:6px;">
        <h3 style="margin:0;">${item.word}</h3>
        <span class="badge">${item.confidence || "AI"}</span>
      </div>
      <p>${item.etymology || "No etymology found."}</p>
    `;
    resultsEl.appendChild(card);
  });
}

async function loadApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["adiTamilApiKey"], (data) => {
      const key = data.adiTamilApiKey || "";
      apiKeyInput.value = key;
      keyStatus.textContent = key ? "Saved" : "Not saved";
      keyStatus.style.color = key ? "#22c55e" : "#f97316";
      resolve(key);
    });
  });
}

function saveApiKey() {
  const key = apiKeyInput.value.trim();
  chrome.storage.sync.set({ adiTamilApiKey: key }, () => {
    keyStatus.textContent = key ? "Saved" : "Not saved";
    keyStatus.style.color = key ? "#22c55e" : "#f97316";
    setStatus(key ? "API key saved." : "API key cleared.");
  });
}

function clearApiKey() {
  apiKeyInput.value = "";
  saveApiKey();
}

async function analyze() {
  const text = quickText.value.trim();
  if (!text) {
    setStatus("Please enter text to analyze.", true);
    return;
  }
  const key = await loadApiKey();
  if (!key) {
    setStatus("Save your Gemini API key first.", true);
    return;
  }

  analyzeBtn.disabled = true;
  setStatus("Analyzing with Gemini...");

  chrome.runtime.sendMessage(
    { type: "ADITAMIL_ANALYZE_TEXT", payload: { text } },
    (response) => {
      analyzeBtn.disabled = false;
      if (chrome.runtime.lastError) {
        setStatus("Extension error. Check background console.", true);
        return;
      }
      if (!response || response.error) {
        setStatus(response?.error || "No response from service.", true);
        return;
      }
      renderResults(response.results);
      setStatus("Done.");
    }
  );
}

saveKeyBtn.addEventListener("click", saveApiKey);
clearKeyBtn.addEventListener("click", clearApiKey);
analyzeBtn.addEventListener("click", analyze);

document.addEventListener("DOMContentLoaded", async () => {
  await loadApiKey();
  renderResults([]);
});

