var gElCanvas
var gCtx
var gIsDragging = false;

function init() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    startEventListeners()
    rednerMemeImages()
    renderSearchedWords()
    saveToStorage('meme-default', gMeme)
}

function startEventListeners() {
    gElCanvas.addEventListener("mousedown", (downEv) => {
        gIsDragging = true
        onStartDrag(downEv)
    })
    gElCanvas.addEventListener("mouseup", () => {
        gIsDragging = false;
        gElCanvas.removeEventListener('mousemove', onSetPosition)
    })
    document.getElementById('btn-upload').addEventListener('click', () => {
        document.getElementById('file-upload').click()
    })
}
function rednerMemeImages(images) {
    var images = !images ? getMemeImages() : images;
    var elImgCon = document.querySelector('.image-container')
    var strHTML = ''
    strHTML += images.map((image, idx) => {
        return `<a href="#meme-modal"><img src='images/${idx + 1}.jpg' 
                id="${image.id}" onclick="toggleModal('${image.id}')"/></a>`
    }).join('')
    elImgCon.innerHTML = strHTML
}

function renderSearchedWords() {
    var words = getKeyWords()
    elWords = document.querySelector('.search-words')
    elWords.innerText = ''
    for (word in words) {
        var size = words[word]
        elWords.innerHTML += `<a class="a-word" style="font-size:${size * 2}px;" 
                                onclick="onFilterImages('${word}')">${word}</a>`
    }
}

function renderStickers() {
    var elSContainer = document.querySelector('.stickers-container')
    const stickersCount = 20; //change if adding more stickers
    var strHtml = ''
    for (var i = 1; i <= stickersCount; i++) {
        strHtml += `<img onclick="onAddSticker(this)" src="images/stickers/${i}.png"/>`
    }
    elSContainer.innerHTML = strHtml
}
function toggleModal(imgId) {
    document.querySelector('.modal').classList.toggle('open')
    document.querySelector('.screen').classList.toggle('on')
    if (document.querySelector('.modal').classList.contains('open')) {
        setCanvasMeme(imgId)
        drawMeme()
        renderStickers()
    }
}
function renderSavedMemes() {
    var images = getSavedMemes()
    var elImgCon = document.querySelector('.image-container')
    document.querySelector('.search-bar').style.display = 'none'
    document.querySelector('.search-words').style.display = 'none'
    if (!images) {
        elImgCon.innerHTML = `<h1 style="grid-column:1/5;">Save Here Your Best And Favorite Memes !</h1>`
        return
    }
    elImgCon.innerHTML = ''
    images.map(imgUrl => {
        var img = document.createElement('img')
        var href = document.createElement('a')
        img.src = imgUrl
        img.width = '300'
        img.height = '300'
        href.download = 'saved-meme'
        href.href = imgUrl
        img.setAttribute('class', 'saved-img')
        href.appendChild(img)
        elImgCon.appendChild(href)

    })
}

function onFilterImages(searchTxt) {
    searchTxt = !searchTxt ? document.getElementById("search-box").value : searchTxt
    var foundImages = filterImages(searchTxt.toLowerCase());
    gKeywords[searchTxt] = gKeywords[searchTxt] ? ++gKeywords[searchTxt] : 1
    rednerMemeImages(foundImages)
    renderSearchedWords()
}



