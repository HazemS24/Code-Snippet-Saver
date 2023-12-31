// content.js

function saveSnippetInContentScript(newSnippet) {
    chrome.storage.sync.get(['snippets'], function (result) {
        const snippets = result.snippets || [];

        if (newSnippet) {
            snippets.push(newSnippet);
            chrome.storage.sync.set({ 'snippets': snippets }, function () {
                // Optional: Notify the user or update the UI
            });
        } else {
            const textboxValue = document.getElementById('snippetInput').value.trim();
            if (textboxValue) {
                snippets.push(textboxValue);
            }
        }
    });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'executeSaveSnippet') {
        const newSnippet = request.newSnippet;
        saveSnippetInContentScript(newSnippet);
    }
});