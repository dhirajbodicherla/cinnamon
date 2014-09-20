$ = document.getElementById.bind(document);

var imagesContainer = document.querySelector('#images');
var image = document.querySelector('#images img');
var closingEl = document.querySelector('.close');
var moreButton = document.querySelector('.more');
var firstElement = $('#first')
var limit = 20;
var min = 0;
var max = limit;
var media;
var SIGNATURE_RE = /var\s+apiSignature\s+=\s+"(.+)";/m;


closingEl.addEventListener('click', closePopup);


checkLogin(function() {
    moreButton.onclick = addImages.bind(this, media);
});


function handleImageClick(media, e) {
    if (e.target.nodeName === 'IMG') {
        window.localStorage.setItem('imageSelected', media[e.target.id].imageUrls.large);
        e.target.className += e.target.className ? ' selected' : 'selected';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { method: "refresh", url: media[e.target.id].imageUrls.large}, function(response) {});
        });
    }
}

function closePopup() {
    window.close();
}

function checkLogin(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var match = SIGNATURE_RE.exec(xhr.responseText);
        if (!match) {
            setStatus('Not logged into Avocado',
                'Oopsie, looks like you need to be logged into Avocado before you can send links with Cilantro.');
            var closeButton = document.querySelector('#status .close');
            closeButton.textContent = 'Login';
            closeButton.removeEventListener('click', closePopup);
            closeButton.addEventListener('click', function() {
                window.open('https://avocado.io/login');
            });
            return;
        }

        var xhrGetImages = new XMLHttpRequest();
        xhrGetImages.onload = function() {
            media = JSON.parse(this.responseText);
            addImages(media);
            callback();
        };
        xhrGetImages.onerror = function() {
            setStatus('Failure: ' + xhrGetImages.responseText);
        };

        xhrGetImages.open(
            'GET',
            'https://avocado.io/api/media?avosig=' + encodeURIComponent(match[1]),
            true);
        xhrGetImages.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrGetImages.send();

    };
    xhr.onerror = function() {
        setStatus('Avocado signature XHR error.' + xhr.responseText);
    };
    xhr.open('GET', 'https://avocado.io/=/', true);
    xhr.send();
}

function addImages(data) {
    for (var i = min; i < limit; i++) {
        var div = document.createElement('div');
        var image = document.createElement('img');
        image.setAttribute('src', data[i].imageUrls.tiny);
        image.setAttribute('id', i);
        var aspectRatio = data[i].info.aspectRatio;
        var width, height;
        if(aspectRatio > 1){
            width = 120;
            height = parseInt(120 / aspectRatio, 10);
        } else {
            height = 120;
            width = parseInt(120 * aspectRatio, 10);
        }
        image.width = width;
        image.height = height;
        div.appendChild(image);
        if(aspectRatio > 1){
            imagesContainer.appendChild(div);
        }else{
            imagesContainer.insertBefore(div, first);
            // imagesContainer.appendChild(div);
        }
        
        image.onclick = handleImageClick.bind(this,data);
    }
    imagesContainer.appendChild(imagesContainer.removeChild(first));
    min = limit;
    limit = limit * 2;
}

function setStatus(message, opt_subMessage) {
    statusMessageNode.textContent = message;
    if (opt_subMessage) statusSubMessageNode.textContent = opt_subMessage;
    document.body.className = 'has-status';
}


// imagesContainer.addEventListener('click', handleImageClick.bind(this, media), false);