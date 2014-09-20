chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('im an ass and i caught it', request.method);
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
});