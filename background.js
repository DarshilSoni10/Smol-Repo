```javascript
let comments = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ comments: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'SAVE_COMMENT') {
    saveComment(request.data);
  } else if (request.message === 'LOAD_COMMENTS') {
    loadComments(request.data);
  } else if (request.message === 'DELETE_COMMENT') {
    deleteComment(request.data);
  }
});

function saveComment(data) {
  comments.push(data);
  chrome.storage.sync.set({ comments: comments });
}

function loadComments(url) {
  chrome.storage.sync.get(['comments'], function(result) {
    sendResponse({ message: 'COMMENTS_LOADED', data: result.comments.filter(comment => comment.url === url) });
  });
}

function deleteComment(id) {
  comments = comments.filter(comment => comment.id !== id);
  chrome.storage.sync.set({ comments: comments });
}
```