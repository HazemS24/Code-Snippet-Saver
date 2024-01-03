document.addEventListener('DOMContentLoaded', function () {
    // Function to retrieve saved snippets from Chrome storage
    function getSavedSnippets() {
        chrome.storage.sync.get(['snippets'], function (result) {
            const snippets = result.snippets || [];
            displaySnippets(snippets);
        });
    }
    
    // Load and display saved snippets when the popup is opened
    getSavedSnippets();

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
            listItem.classList.add('pl-1', 'border', 'w-full', 'mt-2', 'relative', 'max-h-64', 'overflow-y-auto');

            const snippetContent = document.createElement('pre');
            const codeElement = document.createElement('code');
            codeElement.textContent = snippet;
            codeElement.classList.add('mr-8', 'whitespace-pre-wrap');

            const language = hljs.highlightAuto(snippet).language;
            if (language == "php-template" || language == "css" || !language) {
                    codeElement.classList.add(`language-html`);
            } else if (language) {
                    codeElement.classList.add(`language-${language}`);
            }
            snippetContent.appendChild(codeElement);
            
            const copyButton = document.createElement('button');
            copyButton.classList.add('absolute', 'p-1.5', 'rounded-full', 'top-3', 'right-11', 'bg-blue-900', 'w-8', 'h-7', 'border-none', 'cursor-pointer', 'flex', 'items-center', 'justify-center', 'hover:bg-blue-500', 'duration-200', 'z-30');
            copyButton.addEventListener('click', function () {
                copyToClipboard(snippet);
                showCopiedMessage(listItem);
            });

            const clipboardImg = document.createElement('img');
            clipboardImg.src = 'images/clipboard.png'
            clipboardImg.alt = 'Clipboard Icon';
            clipboardImg.classList.add('max-h-full')
            copyButton.appendChild(clipboardImg);


            const removeButton = document.createElement('button');
            removeButton.classList.add('absolute', 'p-1.5', 'rounded-full', 'top-3', 'right-2', 'bg-red-900', 'w-8', 'h-7', 'border-none', 'cursor-pointer', 'flex', 'items-center', 'justify-center', 'hover:bg-red-500', 'duration-200', 'z-30');
            removeButton.addEventListener('click', function () {
                removeSnippet(index);
            });

            const crossImg = document.createElement('img');
            crossImg.src = 'images/cross.png'
            crossImg.alt = 'Cross Icon';
            crossImg.classList.add('max-h-full')
            removeButton.appendChild(crossImg);

            listItem.appendChild(removeButton);
            listItem.appendChild(copyButton);
            listItem.appendChild(snippetContent);
            snippetList.appendChild(listItem);
        });
        Prism.highlightAll();
    }

    function showCopiedMessage(snippetElement) {
        const message = document.createElement('div');
        message.textContent = 'Copied to clipboard!';
        message.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'items-center', 'justify-center', 'bg-black', 'flex', 'opacity-75', 'duration-300', 'text-white', 'text-xl', 'z-20');
        snippetElement.appendChild(message);
      
        // Hide the message after 2 seconds
        setTimeout(() => {
          message.style.display = 'none';
        }, 1200);
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
});
