'use strict'

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gElCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        var elShare=document.getElementById('share-img')
        elShare.innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" 
        title="Share on Facebook" target="_blank" onclick="window.open
        ('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share On Facebook  
        </a>`
        elShare.classList.add('succses')
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('https://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}


function onUserUploadImg(ev) {
    var reader = new FileReader();
    var elImg = new Image();
    elImg.addEventListener('load', function () {
        gElCanvas.height = (elImg.height * gElCanvas.width) / elImg.width
        gMeme.lines[1].posY = gElCanvas.height - 50
        gMeme.elCurrImg = elImg
        drawMeme()
    }, false);
    reader.onload = function () {
        elImg.src = reader.result;
    };
    reader.readAsDataURL(ev.target.files[0]);
    document.querySelector('.modal').classList.toggle('open')
    document.querySelector('.screen').classList.toggle('on')
    renderStickers()
}
