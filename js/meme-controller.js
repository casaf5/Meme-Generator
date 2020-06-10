function rednerPictures() {
    var elImgCon = document.querySelector('.image-container')
    var strHTML = ''
    for (var i = 1; i < 19; i++) {
        strHTML += `<img src='./memes/${i}.jpg' id="${i}" onclick="renderModal(this)"/>`
    }
    elImgCon.innerHTML = strHTML
}

function renderModal(elImg){
    
}