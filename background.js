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
                const selectedText = getSelection().toString();

                chrome.storage.sync.get(['snippets'], function (result) {
                    const snippets = result.snippets || [];

                    if (selectedText) {
                        snippets.push(selectedText);
                        chrome.storage.sync.set({ 'snippets': snippets }, function () {
                        });
                    }
                });
            },
        });
    }
});
