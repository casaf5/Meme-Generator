function rednerPictures(images) {
    var images = !images ? getImages() : images;
    var elImgCon = document.querySelector('.image-container')
    var strHTML = ''
    strHTML += images.map(image => {
        return `<a href="#meme-modal"><img src='../memes/${image.id}.jpg' 
                id="${image.id}" onclick="toggleModal(this)"/></a>`
    }).join('')
    elImgCon.innerHTML = strHTML
}

function renderSearchedWords() {
    var words = getKeyWords()
    elWords = document.querySelector('.search-words')
    elWords.innerText = ''
    for (word in words) {
        var size = words[word] > 20 ? 20 : words[word]
        elWords.innerHTML += `<a class="a-word" style="font-size:${size * 2}px;" 
                                onclick="onFilterImages('${word}')">${word}</a>`
    }
}

function toggleModal(elImg) {
    document.querySelector('.modal').classList.toggle('open')
    document.querySelector('.screen').classList.toggle('on')
    if (document.querySelector('.modal').classList.contains('open')) setCanvasMeme(elImg)
}

function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
}

function renderSavedMemes() {
    var images = getSavedMemes()
    var elImgCon = document.querySelector('.image-container')
    document.querySelector('.search-bar').style.display = 'none'
    document.querySelector('.search-words').style.display = 'none'
    if (!images) {
        elImgCon.innerHTML = `<h1 style="grid-column:1/4;">Save Here Your Best And Favorite Memes !</h1>`
        return
    }
    var strHTML = ''
    elImgCon.innerHTML = ''
    images.map(imgUrl => {
        var img = new Image();
        img.src = imgUrl
        img.width = '300'
        img.height = '300'
        elImgCon.appendChild(img)
    })
}

function onSaveMeme() {         //!add indication that the meme saved
    var meme = gElCanvas.toDataURL()
    saveMeme(meme)
}
function onFilterImages(searchTxt) {
    searchTxt = !searchTxt ? document.getElementById("search-box").value : searchTxt
    var foundImages = filterImages(searchTxt.toLowerCase());
    gKeywords[searchTxt] = gKeywords[searchTxt] ? ++gKeywords[searchTxt] : 1
    rednerPictures(foundImages)
    renderSearchedWords()
}

