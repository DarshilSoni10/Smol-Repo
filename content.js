```javascript
let comments = [];
let currentURL = '';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'LOAD_COMMENTS') {
        currentURL = request.url;
        loadComments();
    } else if (request.message === 'SAVE_COMMENT') {
        saveComment(request.comment);
    } else if (request.message === 'DELETE_COMMENT') {
        deleteComment(request.id);
    }
});

// Load comments from storage
function loadComments() {
    chrome.storage.sync.get([currentURL], function(result) {
        if (result[currentURL]) {
            comments = result[currentURL];
        } else {
            comments = [];
        }
        // Send the comments back to the popup
        chrome.runtime.sendMessage({message: 'COMMENTS_LOADED', comments: comments});
    });
}

// Save comment to storage
function saveComment(comment) {
    comments.push({
        id: Date.now(),
        url: currentURL,
        comment: comment,
        timestamp: new Date().toISOString()
    });
    let saveObj = {};
    saveObj[currentURL] = comments;
    chrome.storage.sync.set(saveObj, function() {
        // Notify the popup that the comment was saved
        chrome.runtime.sendMessage({message: 'COMMENT_SAVED'});
    });
}

// Delete comment from storage
function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    let saveObj = {};
    saveObj[currentURL] = comments;
    chrome.storage.sync.set(saveObj, function() {
        // Notify the popup that the comment was deleted
        chrome.runtime.sendMessage({message: 'COMMENT_DELETED'});
    });
}
```