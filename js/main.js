'use strict';

var gElCanvas
var gCtx
var gIsClicked = false;
var gLastPoint = { x: 0, y: 0 }
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [{ id: 5, url: './memes/5.jpg', keywords: ['happy'] }, { id: 10, url: './memes/10.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        id: 0,
        txt: 'Top Text Line',
        size: 90, align: 'center',
        color: 'black',
        posX: 250,
        posY: 50
    },
    {
        id: 1,
        txt: 'Bottom Text Line',
        size: 40, align: 'center',
        color: 'black',
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
    drawMeme()
}

function onEditNewTxt(elTxt) {
    var focusedLine = getLine(gMeme.selectedLineIdx)
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
        id: gMeme.lines.length,
        txt: 'Enter New Text',
        size: 30, align: 'center',
        color: 'black',
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
        gCtx.font = `${line.size}px Impact`
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
    console.log('clicked')
    const { offsetX: x, offsetY: y } = ev
    console.log(x,y)
    var clickedIdx = gMeme.lines.findIndex(line => {
        var lineWidth = getWidth(line)
        if (x >= line.posX - lineWidth / 2 && x <= (line.posX - lineWidth / 2)+lineWidth && y >= line.posY && y <= line.posY + line.size)
            return line
    })
    if (clickedIdx !== -1) {
        gMeme.selectedLineIdx = clickedIdx
        drawMeme()
    }

}

function focusOnText(focusedLine) {
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
    gCtx.font = `${line.size}px Impact`
    return gCtx.measureText(line.txt).width
}
