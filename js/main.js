'use strict';

var gElCanvas
var gCtx
var gIsClicked = false;
var gLastPoint = { x: 0, y: 0 }
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [{ id: 1, url: '../memes/1.jpg', keywords: ['happy'] },
{ id: 2, url: '../memes/2.jpg', keywords: ['happy'] },
{ id: 3, url: '../memes/3.jpg', keywords: ['happy'] },
{ id: 4, url: '../memes/4.jpg', keywords: ['happy'] },
{ id: 5, url: '../memes/5.jpg', keywords: ['happy'] },
{ id: 6, url: '../memes/6.jpg', keywords: ['happy'] },
{ id: 7, url: '../memes/7.jpg', keywords: ['happy'] },
{ id: 8, url: '../memes/8.jpg', keywords: ['happy'] },
{ id: 9, url: '../memes/9.jpg', keywords: ['happy'] },
{ id: 10, url: '../memes/10.jpg', keywords: ['happy'] },
{ id: 11, url: '../memes/11.jpg', keywords: ['happy'] },
{ id: 12, url: '../memes/12.jpg', keywords: ['happy'] },
{ id: 13, url: '../memes/13.jpg', keywords: ['happy'] },
{ id: 14, url: '../memes/14.jpg', keywords: ['happy'] },
{ id: 15, url: '../memes/15.jpg', keywords: ['happy'] },
{ id: 16, url: '../memes/16.jpg', keywords: ['happy'] },
{ id: 17, url: '../memes/16.jpg', keywords: ['happy'] },
{ id: 18, url: '../memes/16.jpg', keywords: ['happy'] },
];
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [{
        id: 0,
        txt: 'Top Text Line',
        size: 90, align: 'center',
        color: 'white',
        posX: 250,
        posY: 50
    },
    {
        id: 1,
        txt: 'Bottom Text Line',
        size: 40, align: 'center',
        color: 'white',
        posX: 250,
        posY: 450
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
    rednerPictures()
}

function onEditNewTxt(elTxt) {
    var focusedLine = getLine(gMeme.selectedLineIdx)
    focusedLine.txt = elTxt.value
    gCtx.font = `${focusedLine.size}px memeimpact`
    gCtx.align = `${focusedLine.align}`
    gCtx.textBaseline = "top"
    gCtx.fillText(focusedLine.txt, focusedLine.posX, focusedLine.posY,
        gCtx.measureText(focusedLine.txt).width, focusedLine.size)
    drawMeme()
    focusOnText(focusedLine)

}
function addNewTxt() {
    gMeme.lines.push({
        id: gMeme.lines.length,
        txt: 'Enter New Text',
        size: 30, align: 'center',
        color: 'white',
        posX: gElCanvas.width / 2,
        posY: gElCanvas.height / 2,
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    drawMeme()

}
function setCanvasMeme(elImg) {
    gMeme.selectedImgId = +elImg.id
    drawMeme()
}
function setImage(imgId) {
    var img = gImgs.find(img => img.id === imgId)
    var elImg = new Image();
    elImg.src = img.url;
    gCtx.drawImage(elImg, 0, 0, 500, 500);     //!Add correct aspect ratio
}

function drawMeme() {
    setImage(gMeme.selectedImgId)
    gMeme.lines.forEach(line => {
        gCtx.font = `${line.size}px memeimpact`
        gCtx.fillStyle = line.color
        gCtx.textAlign = line.align
        gCtx.textBaseline = "top"
        gCtx.fillText(line.txt, line.posX, line.posY)
    })
    focusOnText(getLine(gMeme.selectedLineIdx))
}

function onChangeFontSize(diff) {
    var focusedLine = getLine(gMeme.selectedLineIdx)
    focusedLine.size += diff
    drawMeme()
}

function onChangeTextFocus() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
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
        document.getElementById('user-txt').value = setInputBoxValue(clickedIdx);
        document.getElementById('user-txt').focus();
        drawMeme()
    }

}
function setInputBoxValue(lineIdx) {
    var line = gMeme.lines.find(line => line.id === lineIdx)
    return line.txt
}

function focusOnText(focusedLine) { //!fix align bux 
    var currWidth = getWidth(focusedLine)
    gCtx.beginPath()
    gCtx.strokeStyle = 'white'
    gCtx.rect(focusedLine.posX - currWidth / 2, focusedLine.posY, currWidth, focusedLine.size)
    gCtx.stroke()
}

function getLine(lineId) {
    return gMeme.lines.find(line => line.id === lineId)
}

function onChangeLineLocation(diff, posToChange) {
    var focusedLine = getLine(gMeme.selectedLineIdx)
    if (posToChange === 'x')
        focusedLine.posX += diff
    else {
        focusedLine.posY += diff
    }
    drawMeme()
}

function getWidth(line) {
    gCtx.font = `${line.size}px memeimpact`
    return gCtx.measureText(line.txt).width
}

function changeTextAlign(align) {
    var line = getLine(gMeme.selectedLineIdx)
    line.align = align;
    drawMeme()
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    drawMeme()
}
