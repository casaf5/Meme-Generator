function rednerPictures() {
    var elImgCon = document.querySelector('.image-container')
    var strHTML = ''
    for (var i = 1; i < 19; i++) {
        strHTML += `<img src='../memes/${i}.jpg' id="${i}" onclick="toggleModal(this)"/>`
    }
    elImgCon.innerHTML = strHTML
}

function toggleModal(elImg) {
    document.querySelector('.modal').classList.toggle('open')
    document.querySelector('.screen').classList.toggle('on')
    if (document.querySelector('.modal').classList.contains('open')) setCanvasMeme(elImg)

}