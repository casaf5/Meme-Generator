'use strict'


function drawMeme() {
    var meme = getMeme()
    redrawImg(meme)
    focusOnElement(meme)
    meme.lines.forEach(line => {
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = line.color
        gCtx.textAlign = line.align
        gCtx.textBaseline = "top"
        gCtx.globalAlpha = line.opacity / 100
        gCtx.fillText(line.txt, line.posX, line.posY)
    })
    meme.stickers.forEach(sticker => {
        gCtx.drawImage(sticker.elSticker, sticker.posX, sticker.posY, sticker.width, sticker.height)
    })
}
function redrawImg(currMeme) {
    gCtx.drawImage(currMeme.elCurrImg, 0, 0, gElCanvas.width, gElCanvas.height)
}
function focusByClick(ev) {
    ev.preventDefault()
    var meme = getMeme()
    const { offsetX: x, offsetY: y } = ev
    var clickedIdx = meme.lines.findIndex(line => {
        var lineWidth = getWidth(line)
        if (x >= line.posX - lineWidth / 2 && x <= (line.posX - lineWidth / 2) + lineWidth && y >= line.posY && y <= line.posY + line.size)
            return line
    })
    if (clickedIdx !== -1) {
        //!fix this - no direct accses to service
        meme.selectedLineIdx = clickedIdx
        meme.focusedEl = { type: 'line', element: meme.lines[clickedIdx] }
        document.getElementById('user-txt').value = meme.lines[clickedIdx].txt
        document.getElementById('user-txt').select();
        document.getElementById('user-txt').focus();
        debugger
        drawMeme()
        return
    }
    //Next- check for click on sticker:
    clickedIdx = meme.stickers.findIndex(sticker => {
        if (x >= sticker.posX && x <= sticker.posX + sticker.width && y >= sticker.posY && y <= sticker.posY + sticker.height)
            return sticker
    })
    if (clickedIdx !== -1) {
        meme.selectedStickerIdx = clickedIdx
        meme.focusedEl = { type: 'sticker', element: meme.stickers[clickedIdx] }
        drawMeme()
    }
}

function focusOnElement(currMeme) {
    var element = getCurrElement()
    if (!element) return     //in case there is nothing on canva.. 
    gCtx.beginPath()
    gCtx.strokeStyle = 'white'
    if (currMeme.focusedEl.type === 'line') {
        var currWidth = getWidth(element)
        const [x, y] = getTextCoords(element, currWidth)
        gCtx.rect(x, y, currWidth, element.size)
    } else {
        gCtx.strokeStyle = 'white'
        gCtx.rect(element.posX, element.posY, element.width, element.height)
    }
    gCtx.stroke()
}

function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
    elLink.innerText = 'Downloaded!'
    elLink.style.backgroundColor = 'green'

}
function onSaveMeme(elSave) {
    var meme = gElCanvas.toDataURL()
    elSave.innerText = 'Meme Saved'
    elSave.style.backgroundColor = 'green'
    saveMeme(meme)
}
function onSetOpacity(value) {
    document.getElementById('label-opacity').innerText = `Text Opacity : ${value}`
    changeSettings('opacity', value)
}

function onStartDrag(downEv) {
    downEv.preventDefault()
    if (gIsDragging) {
        gElCanvas.addEventListener('mousemove', onSetPosition)
    }
}
function onSetPosition(ev) {
    var element = getCurrElement()
    element.posX = ev.offsetX
    element.posY = ev.offsetY
    drawMeme()
}

function onAddSticker(elSticker) {
    addSticker(elSticker)
}

function onRemove() {
    var elToRemove = getCurrElement()
    if (!gMeme.focusedEl.element) return
    removeEl(elToRemove)
    drawMeme()
}

function onResetMeme() {
    resetMeme()
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
}
function onAddNewTxt() {
    addNewTxt()
    drawMeme()
}
function onChangeSettings(option, value) {
    changeSettings(option, value)
    drawMeme()
}
function onChangeElementLocation(diff, posToChange) {
    changeElementLocation(diff * 10, posToChange)
    drawMeme()
}