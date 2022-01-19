function loadTags() {
    var el = document.getElementsByName("tags");
    for (var i = 0; i < el.length; i++) {
        var tags = el[i].getAttribute('value').split(',');
        el[i].innerHTML = '';
        el[i].removeAttribute("value");
        tags.forEach(tag => {
            el[i].innerHTML += `<span class="badge rounded-pill bg-secondary me-1 align-middle" style="display:inline-block;">${tag}</span>`;
        });
    }
}

window.onload = loadTags;