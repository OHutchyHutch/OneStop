
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function copyToClipboard(value, element) {
    // Create a "hidden" input
    var aux = document.createElement("input");

    // Assign it the value of the specified element
    aux.setAttribute("value", value);

    // Append it to the body
    document.body.appendChild(aux);

    // Highlight its content
    aux.select();

    // Copy the highlighted text
    document.execCommand("copy");

    // Remove it from the body
    document.body.removeChild(aux);
    var el = document.querySelector(`#${element} #clipboard`);
    var txtel = document.querySelector(`#${element} #copiedtext`);
    el.classList.remove('bi-clipboard');
    el.classList.add('bi-clipboard-check');
    txtel.innerHTML = "IP Copied";
    txtel.classList.add("me-1");
    await sleep(2000);
    txtel.innerHTML = "";
    txtel.classList.remove("me-1");
    el.classList.remove('bi-clipboard-check');
    el.classList.add('bi-clipboard');

}