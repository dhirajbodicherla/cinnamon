chrome.runtime.sendMessage({method: "getLocalStorage", key: "imageSelected"}, function(response) {
  var url = response.data;
  if(url){
    document.body.style.cssText = "background: url('"+url+"') no-repeat center center fixed;-webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;background-size: cover;";
  }
});