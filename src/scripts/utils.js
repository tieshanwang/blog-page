export function dateFormat(timestamp) {
    const offset = 8 * 60 * 60 * 1000
    const date = new Date(timestamp + offset)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}
