import { createElTextClass } from './helpers.js'
const DATA = {
    default: {
        rgba: 'rgba(75, 150, 150, 1)',
        red: 75, // 0-255
        green: 150, // 0-255
        blue: 150, // 0-255
        hsla: 'hsla(160, 40%, 40%, 1)',
        hue: 160, // 0-360
        saturation: 40, // 0-100
        lightness: 40, // 0-100
        alpha: 1 // 0-1
    }
}
export function createPicker(format) {
    // контейнер
    const container = document.querySelector('main')
    let defaultcolor
    switch (format) {
        case 'rgba':
            container.style.backgroundColor = defaultcolor = DATA.default.rgba
            break
        case 'hsla':
            container.style.backgroundColor = defaultcolor = DATA.default.hsla
            break
    }
    // содержимое
    const picker = createElTextClass('div', null, 'picker')
    picker.dataset.pickeractive = format
    // появление
    container.append(picker)
    // дополнительно
    createNavigation(format)
    createContent(format, defaultcolor)
    setTimeout(() => {
        picker.classList.add('open')
    }, 300)
}
function createNavigation(format) {
    // контейнер
    const container = document.querySelector('.picker')
    // содержимое
    const navigation = createElTextClass('div', null, 'picker_navigation')
    const rgba = createElTextClass('button', 'RGBA')
    rgba.dataset.format = 'rgba'
    rgba.addEventListener('click', changeFormat)
    const hsla = createElTextClass('button', 'HSLA')
    hsla.dataset.format = 'hsla'
    hsla.addEventListener('click', changeFormat)
    switch (format) {
        case 'rgba':
            rgba.classList.add('active')
            break
        case 'hsla':
            hsla.classList.add('active')
            break
    }
    navigation.append(rgba, hsla)
    // появление
    container.append(navigation)
}
function createContent(format, color) {
    // контейнер
    const container = document.querySelector('.picker')
    // содержимое
    const content = createElTextClass('div', null, 'picker_content')
    const setting = createElTextClass('div', null, 'picker_setting') // для слайдеров
    const result = createElTextClass('div', null, 'picker_result') // для выводов
    content.append(setting, result)
    // появление
    container.append(content)
    // дополнительно: заполняем setting слайдерами и result выводами
    switch (format) {
        case 'rgba':
            createSliderWithOutput('red', 0, 255, 1)
            createSliderWithOutput('green', 0, 255, 1)
            createSliderWithOutput('blue', 0, 255, 1)
            createSliderWithOutput('alpha', 0, 1, 0.01)
            break
        case 'hsla':
            createSliderWithOutput('hue', 0, 360, 1)
            createSliderWithOutput('saturation', 0, 100, 1)
            createSliderWithOutput('lightness', 0, 100, 1)
            createSliderWithOutput('alpha', 0, 1, '0.01')
            break
    }
    // дополнительно: добавляем кнопку копирования
    const copy = createElTextClass('button', null, 'picker_copy')
    copy.addEventListener('click', copyColor)
    content.append(copy)
}
function createSliderWithOutput(selector, min, max, step) {
    // контейнеры
    const sliderContainer = document.querySelector('.picker_setting')
    const outputContainer = document.querySelector('.picker_result')
    // содержимое: slider
    const slider = createElTextClass('input', null, selector)
    slider.dataset.slider = selector
    slider.type = 'range'
    slider.min = min
    slider.max = max
    slider.step = step
    slider.value = DATA.default[selector]
    // содержимое: output
    const output = createElTextClass('div', null)
    const outputName = createElTextClass('span', selector.slice(0, 1).toUpperCase())
    const outputValue = createElTextClass('span', DATA.default[selector])
    outputValue.dataset.output = selector
    output.append(outputName, outputValue)
    // связывание slider с output
    slider.oninput = function () {
        outputValue.textContent = this.value
        updateColor(constructColor())
    }
    // появление
    sliderContainer.append(slider)
    outputContainer.append(output)
}
function changeFormat(event) {
    // скрытие контейнера
    let container = document.querySelector('.picker')
    // проверяем клик и текущий формат
    if (container.dataset.pickeractive === event.target.dataset.format) {
        return
    } else {
        container.classList.replace('open', 'tighten') // transition - 1000
        container.dataset.pickeractive = event.target.dataset.format
        setTimeout(() => {
            event.target.classList.add('active') // делаем активной кнопку
            document.querySelector('.picker_content').remove() // убираем старый контент
            switch (event.target.dataset.format) {
                case 'rgba':
                    document.querySelector('[data-format=hsla').removeAttribute('class')
                    document.querySelector('main').style.background = DATA.default.rgba
                    break
                case 'hsla':
                    document.querySelector('[data-format=rgba').removeAttribute('class')
                    document.querySelector('main').style.background = DATA.default.hsla
                    break
            }
            // меняем содержимое, открываем picker
            createContent(event.target.dataset.format)
            container.classList.replace('tighten', 'open')
        }, 1000)
    }
}
function constructColor() {
    const format = document.querySelector(`[data-pickeractive]`).dataset.pickeractive
    let color
    if (format === 'rgba') {
        let red = document.querySelector('[data-slider="red"]').value
        let green = document.querySelector('[data-slider="green"]').value
        let blue = document.querySelector('[data-slider="blue"]').value
        let alpha = document.querySelector('[data-slider="alpha"]').value
        color = `rgba(${red}, ${green}, ${blue}, ${alpha})`
    } else if (format === 'hsla') {
        let hue = document.querySelector('[data-slider="hue"]').value
        let saturation = document.querySelector('[data-slider="saturation"]').value
        let lightness = document.querySelector('[data-slider="lightness"]').value
        let alpha = document.querySelector('[data-slider="alpha"]').value
        color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
    }
    return color
}
function updateColor() {
    document.querySelector('main').style.backgroundColor = constructColor()
}
function copyColor() {
    navigator.clipboard.writeText(constructColor())
    console.log(`Скопировано: ${constructColor()}`)
}
