(function () {
    // Append the bind() polyfill
    var scriptElem = document.createElement('script');
    scriptElem.setAttribute('src', 'scripts/android2.3-jscompat.js');
    if (document.body) {
        document.body.appendChild(scriptElem);
    } else {
        document.head.appendChild(scriptElem);
    }
}());

every = function (arr, func) {
    var l = arr.length;
    for (var i = 0; i < l; i++) {
        if (!func(arr[i])) return false;
    }
    return true;
}