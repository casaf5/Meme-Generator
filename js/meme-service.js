'use strict';
var gKeywords = { 'happy': 12, 'man': 20, 'dog': 5, 'kiss': 1, 'hat': 9, 'baby': 20, 'glasses': 20, 'movie': 30, 'lol': 10, 'dance': 20 }
var gMemeImgs = _createMemeImages()
var gSavedMemes = []
var gMeme = {
    elCurrImg: null,
    selectedImgId: 0,
    selectedLineIdx: 0,
    selectedStickerIdx: 0,
    focusedEl: { type: 'line', element: null, },
    lines: [{
        id: genID(),
        txt: 'Top Text Line',
        size: 60, align: 'center',
        color: 'white',
        font: 'Impact',
        opacity: '100',
        posX: 250,
        posY: 20
    },
    {
        id: genID(),
        txt: 'Bottom Text Line',
        size: 40, align: 'center',
        color: 'white',
        font: 'Impact',
        opacity: '100',
        posX: 250,
        posY: 300
    }],
    stickers: []
}

function _createMemeImg(id,url,words=[]) {
    var newMeme={
        id,
        url,
        words,
    }
    return newMeme;
}

function _createMemeImages() {
    var memes=[]
    memes.push(_createMemeImg(genID(),'images/1.jpg'),['tooth', 'trump', 'donald'])
    memes.push(_createMemeImg(genID(),'images/2.jpg'),['dogs', 'lick'])
    memes.push(_createMemeImg(genID(),'images/3.jpg'),['baby', 'sleep', 'dog'])
    memes.push(_createMemeImg(genID(),'images/4.jpg'),['cat', 'keyboard', 'sleep'])
    memes.push(_createMemeImg(genID(),'images/5.jpg'),['win', 'badass', 'baby', 'beach'])
    memes.push(_createMemeImg(genID(),'images/6.jpg'),['size', 'professor', 'man', 'hands'])
    memes.push(_createMemeImg(genID(),'images/7.jpg'),['shock', 'baby', 'little'])
    memes.push(_createMemeImg(genID(),'images/8.jpg'),['hat', 'purpple', 'man'] )
    memes.push(_createMemeImg(genID(),'images/9.jpg'),['baby', 'happy', 'little'])
    memes.push(_createMemeImg(genID(),'images/10.jpg'),['happy', 'laugh', 'barak', 'obama'])
    memes.push(_createMemeImg(genID(),'images/11.jpg'),['kiss,man'] )
    memes.push(_createMemeImg(genID(),'images/12.jpg'),['finger', 'glasses', 'israel', 'hands'])
    memes.push(_createMemeImg(genID(),'images/13.jpg'),['cheers', 'leonardo dicaprio', 'wine', 'glass', 'hand'])
    memes.push(_createMemeImg(genID(),'images/14.jpg'),['matrix', 'glasses'])
    memes.push(_createMemeImg(genID(),'images/15.jpg'),['game of thrones', 'hair', 'hands'])
    memes.push(_createMemeImg(genID(),'images/16.jpg'),['movie', 'startrek', 'red shirt', 'hands'])
    memes.push(_createMemeImg(genID(),'images/17.jpg'),['vladimir putin', 'russia', 'suit', 'hands'])
    memes.push(_createMemeImg(genID(),'images/18.jpg'),['toystory', 'bazz', 'woody', 'movie', 'cartoon'])
    memes.push(_createMemeImg(genID(),'images/19.jpg'),['lady', 'nature'])
    memes.push(_createMemeImg(genID(),'images/20.jpg'),['dance', 'boy', 'baby'])
    return memes;
}

function setCanvasMeme(elImg) {
    gMeme.selectedImgId = +elImg.id
    setImage(gMeme.selectedImgId)
}
function setImage(imgId) {
    var img = gMemeImgs.find(img => img.id === imgId)
    var elImg = new Image();
    elImg.src = img.url;
    gElCanvas.height = (elImg.height * gElCanvas.width) / elImg.width
    gMeme.lines[1].posY = gElCanvas.height - 50 //for correct aspect ratio
    gMeme.elCurrImg = elImg
}

function addNewTxt() {
    gMeme.lines.push({
        id: genID(),
        txt: 'Enter New Text',
        size: 30, align: 'center',
        color: 'black',
        font: 'Impact',
        opacity: 100,
        posX: gElCanvas.width / 2,
        posY: gElCanvas.height / 2,
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}
function addSticker(sticker) {
    gCtx.drawImage(sticker, gElCanvas.width / 2, gElCanvas.height / 2, 60, 60)
    gMeme.stickers.push({
        id: genID(),
        elSticker: sticker,
        width: sticker.width,
        height: sticker.height,
        posX: gElCanvas.width / 2,
        posY: gElCanvas.height / 2
    })
}

function changeElementLocation(diff, posToChange) {
    var focusedOn = getCurrElement()
    if (!focusedOn) return
    if (posToChange === 'x')
        focusedOn.posX += diff
    else {
        focusedOn.posY += diff
    }
}

function changeSettings(option, value) {
    if (!gMeme.focusedEl.element) return
    if (gMeme.focusedEl.type !== 'line' && option == 'size') {  //for sticker
        var focusedOn = gMeme.focusedEl.element
        focusedOn.width += value
        focusedOn.height += value
    } else {
        var line = gMeme.focusedEl.element
        line[option] = option !== 'size' ? value : line[option] + value
    }
}

function getWidth(line) {
    gCtx.font = `${line.size}px ${line.font}`
    return gCtx.measureText(line.txt).width
}

function getMeme(){
    return gMeme;
}
function getMemeImages() {
    return gMemeImgs;
}

function getSavedMemes() {
    var memes = loadFromStorage('gSavedMemes')
    return memes
}
function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}
function getCurrSticker() {
    return gMeme.stickers[gMeme.selectedStickerIdx]
}
function getKeyWords() {
    return gKeywords;
}
function getCurrElement() {
    return gMeme.focusedEl.element
}

function getTextCoords(line, width) {
    switch (line.align) {
        case 'left':
            return [line.posX, line.posY]
        case 'right':
            return [line.posX - width, line.posY]
        case 'center':
            return [line.posX - width / 2, line.posY]
    }
}

function saveMeme(meme) {
    gSavedMemes = !loadFromStorage('gSavedMemes') ? [] : loadFromStorage('gSavedMemes')
    gSavedMemes.push(meme)
    saveToStorage('gSavedMemes', gSavedMemes)
}
function resetMeme() {
    var lastImgIdx = gMeme.selectedImgId
    gMeme = loadFromStorage('meme-default')
    gMeme.selectedImgId = lastImgIdx
    setImage(lastImgIdx)
    drawMeme()
}
function filterImages(searchTxt) {
    var images = gMemeImgs.reduce((acc, image) => {
        if (image.keywords.join('').includes(searchTxt)) acc.push(image)
        return acc
    }, [])
    return images
}
function removeEl(el) {
    if (el.type === 'line') {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        gMeme.selectedLineIdx = 0;
    } else {
        gMeme.stickers.splice(gMeme.selectedStickerIdx, 1)
        gMeme.selectedStickerIdx = 0;
    }
    gMeme.focusedEl.element = gMeme.lines[0]
   
}




