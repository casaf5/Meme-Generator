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

function renderWords(){

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

// function renderSavedMemes(){
//     var images = getImages()
//     var elImgCon = document.querySelector('.image-container')
//     var strHTML = ''
//     strHTML += images.map(image => {
//         return `<a href="#meme-modal"><img src='../memes/${image.id}.jpg' 
//                 id="${image.id}" onclick="toggleModal(this)"/></a>`
//     }).join('')
//     elImgCon.innerHTML = strHTML
// }

function onFilterImages(searchTxt) {
    searchTxt = !searchTxt ? document.getElementById("search-box").value : searchTxt
    var foundImages = filterImages(searchTxt.toLowerCase());
    gKeywords[searchTxt] = gKeywords[searchTxt] ? ++gKeywords[searchTxt] : 1
    rednerPictures(foundImages)
}