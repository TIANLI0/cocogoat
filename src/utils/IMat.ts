import { ICVMat } from './cv'
export function IMatFromImageData(d: ImageData): ICVMat {
    return {
        rows: d.height,
        cols: d.width,
        type: 24, // CV_8UC4
        data: new Uint8Array(d.data),
    }
}
export function IMatFromImageElement(img: HTMLImageElement): ICVMat {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas.getContext("2d") failed')
    ctx.drawImage(img, 0, 0)
    return IMatFromImageData(ctx.getImageData(0, 0, img.width, img.height))
}
export function toCanvas(d: ICVMat) {
    if (d.type !== 24) {
        throw new Error(`Converting type ${d.type} to canvas faild. Only CV_8UC4 is supported.`)
    }
    const canvas = document.createElement('canvas')
    canvas.width = d.cols
    canvas.height = d.rows
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Could not get context')
    }
    const imgData = ctx.createImageData(d.cols, d.rows)
    imgData.data.set(d.data)
    ctx.putImageData(imgData, 0, 0)
    return canvas
}
