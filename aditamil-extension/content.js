(() => {
  const PANEL_ID = "aditamil-panel";

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "ADITAMIL_SHOW_RESULTS") {
      renderPanel(message.payload?.results || []);
    }
    if (message.type === "ADITAMIL_NOTIFY") {
      renderPanel([], message.payload?.message);
    }
  });

  function renderPanel(results, notice) {
    removePanel();
    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.className = "aditamil-panel";

    const header = document.createElement("div");
    header.className = "aditamil-header";
    header.innerHTML = `<div class="aditamil-title">AdiTamil</div><button class="aditamil-close" aria-label="Close">×</button>`;
    header.querySelector(".aditamil-close").onclick = removePanel;
    panel.appendChild(header);

    const body = document.createElement("div");
    body.className = "aditamil-body";
    if (notice) {
      const noticeEl = document.createElement("div");
      noticeEl.className = "aditamil-notice";
      noticeEl.textContent = notice;
      body.appendChild(noticeEl);
    } else if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "aditamil-empty";
      empty.textContent = "No Tamil-origin words detected.";
      body.appendChild(empty);
    } else {
      results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "aditamil-card";
        card.innerHTML = `
          <div class="aditamil-card-header">
            <div>
              <div class="aditamil-word">${item.word}</div>
              <div class="aditamil-confidence">${item.confidence || "AI"}</div>
            </div>
            <button class="aditamil-copy">Copy</button>
          </div>
          <div class="aditamil-etymology">${item.etymology || ""}</div>
        `;
        card.querySelector(".aditamil-copy").onclick = () =>
          navigator.clipboard.writeText(
            `${item.word}: ${item.etymology || ""}`
          );
        body.appendChild(card);
      });
    }
    panel.appendChild(body);

    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add("visible"));
  }

  function removePanel() {
    const existing = document.getElementById(PANEL_ID);
    if (existing) existing.remove();
  }
})();

