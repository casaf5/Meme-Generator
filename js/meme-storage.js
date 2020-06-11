function loadFromStorage(key) {
    var json = JSON.parse(localStorage.getItem(key))
    return json
}

function saveToStorage(key, value) {
    var json = JSON.stringify(value)
    localStorage.setItem(key, json)
}