function saveSnippet(newSnippet) {
    chrome.storage.sync.get(['snippets'], function (result) {
        const snippets = result.snippets || [];

        if (newSnippet) {
            // const formattedSnippet = formatMultilineSnippet(newSnippet);
            snippets.push(newSnippet);
            chrome.storage.sync.set({ 'snippets': snippets }, function () {
                // Optional: Notify the user or update the UI
            });
        } else {
            // If newSnippet is not provided, try to get it from a textbox with the id 'snippetInput'
            const textboxValue = document.getElementById('snippetInput').value.trim();
            if (textboxValue) {
                // const formattedSnippet = formatMultilineSnippet(textboxValue);
                snippets.push(textboxValue);
            }
        }
    });
}

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: 'addSnippetContextMenu',
        title: 'Add as Snippet',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'addSnippetContextMenu') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                // Get the selected text using getSelection
                const selectedText = getSelection().toString();

                // Save snippet logic
                chrome.storage.sync.get(['snippets'], function (result) {
                    const snippets = result.snippets || [];

                    if (selectedText) {
                        snippets.push(selectedText);
                        chrome.storage.sync.set({ 'snippets': snippets }, function () {
                            // Optional: Notify the user or update the UI
                            console.log('Snippet saved:', selectedText);
                        });
                    } else {
                        // If selectedText is not available, try to get it from a textbox with the id 'snippetInput'
                        const textboxValue = document.getElementById('snippetInput').value.trim();
                        if (textboxValue) {
                            snippets.push(textboxValue);
                            console.log('Snippet saved:', textboxValue);
                        }
                    }
                });
            },
        });
    }
});


// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === 'addSnippetContextMenu') {
//       // Execute script only when "Add as Snippet" is clicked
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: () => {
//           saveSnippet(getSelection().toString());
//         },
//       });
//     }
// });

// chrome.contextMenus.onClicked.addListener(function (info, tab) {
//     if (info.menuItemId === 'addSnippetContextMenu') {
//         // const selectedText = window.getSelection().toString();
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             var activeTab = tabs[0];
          
//             // Retrieve the selected data using window.getSelection().focusNode.data
//             chrome.scripting.executeScript({
//               target: { tabId: activeTab.id },
//               function: function () {
//                 var selection = window.getSelection();
//                     return selection.focusNode && selection.focusNode.nodeType === Node.TEXT_NODE
//                         ? selection.focusNode.data
//                         : null;
//               },
//             }, function (result) {
//               // The result will contain the value of window.getSelection().focusNode.data
//               var selectedData = result[0];
          
//               // Now you can use the selectedData as needed
//               console.log(selectedData.toString());
//         });
//     });
//         // saveSnippet(selectedText);
//     }
// });

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'saveSnippet') {
        const newSnippet = request.newSnippet;
        chrome.storage.sync.get(['snippets'], function (result) {
            const snippets = result.snippets || [];
            const formattedSnippet = formatMultilineSnippet(newSnippet);
            snippets.push(formattedSnippet);
            chrome.storage.sync.set({ 'snippets': snippets }, function () {
                // Send a message to update the displayed snippets in the popup
                chrome.runtime.sendMessage({ action: 'updateSnippets', snippets: snippets });
            });
        });
    }
});

// Function to format a multiline snippet
function formatMultilineSnippet(snippet) {
    // Replace consecutive spaces with a single space
    snippet = snippet.replace(/\s+/g, ' ');
    // Add a newline after each semicolon to separate statements
    snippet = snippet.replace(/\r?\n/g, '\\n');
    return snippet;
}
