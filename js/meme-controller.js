function startEventListeners() {
    gElCanvas.addEventListener("mousedown", (downEv) => {
        gIsDragging = true
        onStartDrag(downEv)
    })
    gElCanvas.addEventListener("mouseup", () => {
        gIsDragging = false;
        gElCanvas.removeEventListener('mousemove', setPosition)
    })
    document.getElementById('btn-upload').addEventListener('click', () => {
        document.getElementById('file-upload').click()
    })
}
function rednerPictures(images) {
    var images = !images ? getImages() : images;
    var elImgCon = document.querySelector('.image-container')
    var strHTML = ''
    strHTML += images.map(image => {
        return `<a href="#meme-modal"><img src='images/${image.id}.jpg' 
                id="${image.id}" onclick="toggleModal(this)"/></a>`
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
function toggleModal(elImg) {
    document.querySelector('.modal').classList.toggle('open')
    document.querySelector('.screen').classList.toggle('on')
    if (document.querySelector('.modal').classList.contains('open')) {
        setCanvasMeme(elImg)
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
        img.setAttribute('class','saved-img')
        href.appendChild(img)
        elImgCon.appendChild(href)

    })
}
function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
    elLink.innerText = 'Downloaded!'
    elLink.style.backgroundColor = 'green'

}
function onSaveMeme(elSave) {
    var meme = gElCanvas.toDataURL()
    elSave.innerText = 'Meme Saved'
    elSave.style.backgroundColor = 'green'
    saveMeme(meme)
}
function onFilterImages(searchTxt) {
    searchTxt = !searchTxt ? document.getElementById("search-box").value : searchTxt
    var foundImages = filterImages(searchTxt.toLowerCase());
    gKeywords[searchTxt] = gKeywords[searchTxt] ? ++gKeywords[searchTxt] : 1
    rednerPictures(foundImages)
    renderSearchedWords()
}

function onSetOpacity(value) {
    document.getElementById('label-opacity').innerText = `Text Opacity : ${value}`
    changeSettings('opacity', value)
}

function onStartDrag(downEv) {
    downEv.preventDefault()
    if (gIsDragging) {
        gElCanvas.addEventListener('mousemove', setPosition)
    }
}
function setPosition(ev) {
    var element = gMeme.focusedEl.element
    element.posX = ev.offsetX
    element.posY = ev.offsetY
    drawMeme()
}

function onAddSticker(elSticker) {
    addSticker(elSticker)
}

