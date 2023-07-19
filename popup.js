```javascript
let comments = [];
let currentURL = '';

document.getElementById('saveButton').addEventListener('click', saveComment);
document.getElementById('optionsButton').addEventListener('click', openOptions);

function saveComment() {
    let commentInput = document.getElementById('commentInput');
    let comment = commentInput.value.trim();
    if (comment) {
        let commentObj = {
            id: Date.now(),
            url: currentURL,
            comment: comment,
            timestamp: new Date().toISOString()
        };
        comments.push(commentObj);
        chrome.storage.sync.set({ [currentURL]: comments }, function() {
            commentInput.value = '';
            loadComments();
        });
    }
}

function loadComments() {
    chrome.storage.sync.get(currentURL, function(result) {
        comments = result[currentURL] || [];
        let commentList = document.getElementById('commentList');
        commentList.innerHTML = '';
        comments.forEach(function(commentObj) {
            let listItem = document.createElement('li');
            listItem.textContent = commentObj.comment;
            commentList.appendChild(listItem);
        });
    });
}

function openOptions() {
    chrome.runtime.openOptionsPage();
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    currentURL = new URL(tabs[0].url).hostname;
    loadComments();
});
```