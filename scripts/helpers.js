export function createElTextClass(tag, text, ...selectors) {
    let element = document.createElement(tag)
    if (text !== null) {
        element.textContent = text
    }
    for (let selector of selectors) {
        element.classList.add(selector)
    }
    return element
}
