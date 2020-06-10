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
        txt: 'I never eat Falafel',
        size: 20, align: 'left',
        color: 'red'
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
    gCtx.font = '30px Impact'
    gCtx.fillText(userTxt, 250, 250)

}


function drawImg2() {
    var elImg = new Image();
    elImg.src = './memes/1.jpg';
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, 500, 500);
    }
}
