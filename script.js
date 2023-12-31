document.addEventListener('DOMContentLoaded', function () {
    // Function to retrieve saved snippets from Chrome storage
    function getSavedSnippets() {
        chrome.storage.sync.get(['snippets'], function (result) {
            const snippets = result.snippets || [];
            displaySnippets(snippets);
        });
    }

    // Function to copy the code to the clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
    }

    // Function to display snippets in the popup
    function displaySnippets(snippets) {
        const snippetList = document.getElementById('snippetList');
        snippetList.innerHTML = '';

        snippets.reverse();

        snippets.forEach(function (snippet, index) {
            const listItem = document.createElement('div');
            listItem.classList.add('pl-1', 'border', 'm-2', 'ml-0', 'relative', 'max-h-64', 'overflow-y-auto');

            const snippetContent = document.createElement('pre');
            const codeElement = document.createElement('code');
            console.log(snippet)
            codeElement.textContent = snippet;
            codeElement.classList.add('mr-8', 'whitespace-pre-wrap');

            const language = hljs.highlightAuto(snippet).language;
            if (language == "php-template" || !language) {
                    codeElement.classList.add(`language-html`);
            } else if (language) {
                    codeElement.classList.add(`language-${language}`);
            }
            snippetContent.appendChild(codeElement);
            
            const copyButton = document.createElement('button');
            copyButton.innerHTML = 'Copy Code';
            copyButton.classList.add('absolute', 'p-1', 'rounded-full', 'top-2', 'right-16', 'bg-blue-500', 'text-white', 'border-none', 'cursor-pointer');
            copyButton.addEventListener('click', function () {
                copyToClipboard(snippet);
            });

            const removeButton = document.createElement('button');
            removeButton.innerHTML = '&#10006;';
            removeButton.classList.add('absolute', 'p-1', 'rounded-full', 'top-2', 'right-2', 'bg-red-500', 'white', 'border-none', 'cursor-pointer');
            removeButton.addEventListener('click', function () {
                removeSnippet(index);
            });

            listItem.appendChild(removeButton);
            listItem.appendChild(copyButton);
            listItem.appendChild(snippetContent);
            snippetList.appendChild(listItem);
        });
        Prism.highlightAll();
    }

    // Function to save a new snippet to Chrome storage
    function saveSnippet(newSnippet) {
        chrome.storage.sync.get(['snippets'], function (result) {
          const snippets = result.snippets || [];
    
          snippets.push(newSnippet);
          chrome.storage.sync.set({ 'snippets': snippets }, function () {
            displaySnippets(snippets);
          });
        });
    }

    // Function to remove a snippet from Chrome storage
    function removeSnippet(index) {
        chrome.storage.sync.get(['snippets'], function (result) {
            const snippets = result.snippets || [];

            const originalIndex = snippets.length - 1 - index;

            if (originalIndex >= 0 && originalIndex < snippets.length) {
                snippets.splice(originalIndex, 1);
                chrome.storage.sync.set({ 'snippets': snippets }, function () {
                    displaySnippets(snippets);
                });
            }
        });
    }

    // Event listener for the "Save Snippet" button
    document.getElementById('saveSnippet').addEventListener('click', function () {
        const newSnippet = document.getElementById('snippetInput').value.trim();
        if (newSnippet) {
            saveSnippet(newSnippet);
            // Clear the textarea after saving the snippet
            document.getElementById('snippetInput').value = '';
        }
    });
    document.getElementById('saveSnippet').classList.add('w-full', 'max-w-full');

    // Load and display saved snippets when the popup is opened
    getSavedSnippets();
});
