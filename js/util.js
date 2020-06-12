function genID(len = 5) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    var randID = ''
    for (let i = 0; i < len; i++) {
        randID += chars[getRandomInteger(0, chars.length)]
    }
    return randID;
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}