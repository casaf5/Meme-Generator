'use strict';

var gElCanvas
var gCtx
var gIsDragging = false;
var gLastPoint = { x: 0, y: 0 }
var gKeywords = { 'happy': 12, 'man': 20, 'dog': 5, 'kiss': 1, 'hat': 9, 'baby': 20, 'glasses': 20, 'movie': 30, 'lol': 10, 'dance': 20 }
var gImgs = [{ id: 1, url: 'images/1.jpg', keywords: ['tooth', 'trump', 'donald'] },
{ id: 2, url: "images/2.jpg", keywords: ['dogs', 'lick'] },
{ id: 3, url: "images/3.jpg", keywords: ['baby', 'sleep', 'dog'] },
{ id: 4, url: "images/4.jpg", keywords: ['cat', 'keyboard', 'sleep'] },
{ id: 5, url: "images/5.jpg", keywords: ['win', 'badass', 'baby', 'beach'] },
{ id: 6, url: "images/6.jpg", keywords: ['size', 'professor', 'man', 'hands'] },
{ id: 7, url: "images/7.jpg", keywords: ['shock', 'baby', 'little'] },
{ id: 8, url: "images/8.jpg", keywords: ['hat', 'purpple', 'man'] },
{ id: 9, url: "images/9.jpg", keywords: ['baby', 'happy', 'little'] },
{ id: 10, url: "images/10.jpg", keywords: ['happy', 'laugh', 'barak', 'obama'] },
{ id: 11, url: "images/11.jpg", keywords: ['kiss,man'] },
{ id: 12, url: "images/12.jpg", keywords: ['finger', 'glasses', 'israel', 'hands'] },
{ id: 13, url: "images/13.jpg", keywords: ['cheers', 'leonardo dicaprio', 'wine', 'glass', 'hand'] },
{ id: 14, url: "images/14.jpg", keywords: ['matrix', 'glasses'] },
{ id: 15, url: "images/15.jpg", keywords: ['game of thrones', 'hair', 'hands'] },
{ id: 16, url: "images/16.jpg", keywords: ['movie', 'startrek', 'red shirt', 'hands'] },
{ id: 17, url: "images/17.jpg", keywords: ['vladimir putin', 'russia', 'suit', 'hands'] },
{ id: 18, url: "images/18.jpg", keywords: ['toystory', 'bazz', 'woody', 'movie', 'cartoon'] },
{ id: 19, url: "images/19.jpg", keywords: ['lady', 'nature'] },
{ id: 20, url: "images/20.jpg", keywords: ['dance', 'boy', 'baby'] },
];
var gSavedMemes = []
var gMeme = {
    linesCount: 2,
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [{
        id: 0,
        txt: 'Top Text Line',
        size: 60, align: 'center',
        color: 'black',
        font: 'Impact',
        opacity: '100',
        posX: 250,
        posY: 20
    },
    {
        id: 1,
        txt: 'Bottom Text Line',
        size: 40, align: 'center',
        color: 'black',
        font: 'Impact',
        opacity: '100',
        posX: 250,
        posY: 300
    }]
}
var gSettings = {
    color: 'black',
    shape: 'line',
    opacity: 100,
}

function init() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    startEventListeners()
    rednerPictures()
    renderSearchedWords()
    saveToStorage('meme-default', gMeme)
}

function drawMeme() {
    setImage(gMeme.selectedImgId)
    var currLine = getCurrLine()
    focusOnText(currLine)
    gMeme.lines.forEach(line => {
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = line.color
        gCtx.textAlign = line.align
        gCtx.textBaseline = "top"
        gCtx.globalAlpha = line.opacity / 100
        gCtx.fillText(line.txt, line.posX, line.posY)
    })

}

function onEditNewTxt(elTxt) {
    var focusedLine = getCurrLine()
    focusedLine.txt = elTxt.value
    gCtx.font = `${focusedLine.size}px Impact`
    gCtx.align = `${focusedLine.align}`
    gCtx.textBaseline = "top"
    gCtx.fillText(focusedLine.txt, focusedLine.posX, focusedLine.posY,
        gCtx.measureText(focusedLine.txt).width, focusedLine.size)
    drawMeme()
    focusOnText(focusedLine)
}

function addNewTxt() {
    gMeme.lines.push({
        id: ++gMeme.linesCount,
        txt: 'Enter New Text',
        size: 30, align: 'center',
        color: 'black',
        font: 'Impact',
        opacity: 100,
        posX: gElCanvas.width / 2,
        posY: gElCanvas.height / 2,
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    drawMeme()
}
function setCanvasMeme(elImg) {
    gMeme = loadFromStorage('meme-default')
    gMeme.selectedImgId = +elImg.id
    drawMeme()
}
function setImage(imgId) {
    var img = gImgs.find(img => img.id === imgId)
    var elImg = new Image();
    elImg.src = img.url;
    gElCanvas.height = (elImg.height * gElCanvas.width) / elImg.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
    gMeme.lines[1].posY = gElCanvas.height - 50

}
function onChangeFontSize(diff) {
    var focusedLine = getCurrLine()
    focusedLine.size += diff
    drawMeme()
}
function onChangeLineLocation(diff, posToChange) {
    var focusedLine = getCurrLine()
    if (posToChange === 'x')
        focusedLine.posX += diff
    else {
        focusedLine.posY += diff
    }
    drawMeme()
}

function onChangeTextFocus() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
    drawMeme()
}
function changeTextAlign(align) {
    var line = getCurrLine()
    line.align = align;
    drawMeme()
}
function changeTextColor(color) {
    var line = getCurrLine()
    line.color = color;
    drawMeme()
}
function changeTextFont(value) {
    var line = getCurrLine()
    line.font = `${value}`;
    drawMeme()
}
function changeTextOpcity(value) {
    var line = getCurrLine()
    line.opacity = value
    drawMeme()
}

function focusByClick(ev) {
    ev.preventDefault()
    const { offsetX: x, offsetY: y } = ev
    var clickedIdx = gMeme.lines.findIndex(line => {
        var lineWidth = getWidth(line)
        if (x >= line.posX - lineWidth / 2 && x <= (line.posX - lineWidth / 2) + lineWidth && y >= line.posY && y <= line.posY + line.size)
            return line
    })
    if (clickedIdx !== -1) {
        gMeme.selectedLineIdx = clickedIdx
        document.getElementById('user-txt').value = gMeme.lines[clickedIdx].txt
        document.getElementById('user-txt').select();
        document.getElementById('user-txt').focus();
        drawMeme()
    }

}
function focusOnText(focusedLine) {
    var currWidth = getWidth(focusedLine)
    const [x, y] = getTextCoords(focusedLine, currWidth)
    gCtx.beginPath()
    gCtx.strokeStyle = 'white'
    gCtx.rect(x, y, currWidth, focusedLine.size)
    gCtx.stroke()
}
function getWidth(line) {
    gCtx.font = `${line.size}px ${line.font}`
    return gCtx.measureText(line.txt).width
}

function getImages() {
    return gImgs;
}

function getSavedMemes() {
    var memes = loadFromStorage('gSavedMemes')
    return memes
}
function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
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
function getKeyWords() {
    return gKeywords;
}

function saveMeme(meme) {
    gSavedMemes = !loadFromStorage('gSavedMemes') ? [] : loadFromStorage('gSavedMemes')
    gSavedMemes.push(meme)
    saveToStorage('gSavedMemes', gSavedMemes)
}
function resetMeme() {
    var currMemeIdx = gMeme.selectedImgId
    gMeme = loadFromStorage('meme-default')
    gMeme.selectedImgId = currMemeIdx
    drawMeme()
}
function filterImages(searchTxt) {              //!ADD SUPPORTS for more then 1 word 
    var images = gImgs.reduce((acc, image) => {
        if (image.keywords.join('').includes(searchTxt)) acc.push(image)
        return acc
    }, [])
    return images
}
function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0;
    drawMeme()
}


