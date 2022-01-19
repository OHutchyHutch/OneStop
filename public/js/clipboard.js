async function copyToClipboard(value) {
    var range = document.createRange();
    range.selectNode(document.getElementById(value));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
    var el = document.querySelector(`#${value} #clipboard`);
    el.classList.remove('bi-clipboard');
    el.classList.add('bi-clipboard-check');
    await sleep(2000);
    el.classList.remove('bi-clipboard-check');
    el.classList.add('bi-clipboard');
}
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}