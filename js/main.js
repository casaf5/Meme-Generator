'use strict';

var gElCanvas
var gCtx
var gIsClicked = false;
var gLastPoint = { x: 0, y: 0 }
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        id: 0,
        txt: 'Top Text Line',
        size: 40, align: 'center',
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
    setCanvas()
    document.addEventListener('mousedown', (ev) => {
        gIsClicked = true
        gLastPoint.x = ev.offsetX
        gLastPoint.y = ev.offsetY
    })
    document.addEventListener('mouseup', () => {
        gIsClicked = false
    })
    drawImg2()
}


function setCanvas() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
}

function startDraw(ev) {
    const { offsetX: x, offsetY: y } = ev
    gCtx.strokeStyle = gSettings.color
    gCtx.fillStyle = gSettings.color
    gCtx.globalAlpha = gSettings.opacity / 100
    gCtx.beginPath()
    if (gIsClicked) {
        switch (gSettings.shape) {
            case 'line':
                drawLine(x, y)
                break;
            case 'rect':
                drawRect(x, y)
                break;
            case 'circle':
                drawCircle(x, y)
        }
        gLastPoint.x = x
        gLastPoint.y = y
    }

}
function drawLine(x, y) {
    gCtx.moveTo(gLastPoint.x, gLastPoint.y)
    gCtx.lineTo(x, y)
    gCtx.closePath()
    gCtx.stroke()
}

function drawTxt() {
    var userTxt = document.getElementById('user-txt').value
    gMeme.lines.push({
        id: gMeme.lines.length,
        txt: userTxt,
        size: 40, align: 'center',
        color: 'black',
        posX: 250,
        posY: 250,
    })
    drawMeme()
}

function setCanvasMeme(elImg) {
    gCtx.drawImage(elImg, 0, 0, 500, 500);
    gMeme.selectedImgId = elImg.id
    drawMeme()
}
function drawImg2() {
    var elImg = new Image();
    elImg.src = './memes/1.jpg';
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, 500, 500);
    }
}

function drawMeme() {
    gMeme.lines.forEach(line => {
        gCtx.font = `${line.size}px Impact`
        gCtx.fillStyle = line.color
        gCtx.textAlign = line.align
        gCtx.fillText(line.txt, line.posX, line.posY)
    })

}

function onChangeFontSize(diff) {
    var focusedLine = getLine(gMeme.selectedLineIdx)
    focusedLine.size += diff
    gCtx.clearRect(0, 0, 500, 500)
    drawMeme()
}

function onChangeTextFocus() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
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
    gCtx.clearRect(0, 0, 500, 500)
    drawMeme()
}
