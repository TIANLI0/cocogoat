import { hasSimd } from './WasmFeatureCheck'

// 检查WASM
export const hasWasm = 'WebAssembly' in window
// 检查getDisplayMedia
export const hasGetDisplayMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
// 检查PictureInPicture
export const hasPictureInPicture = !!document.pictureInPictureEnabled
// Safari
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
// Android
export const isAndroid = /android/i.test(navigator.userAgent)
// iOS
export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
// SIMD
export const hasSIMD = hasSimd()
// 本地
export const isLocal = process.env.VUE_APP_LOCALRES === 'true'
// OCR需要WASM，且如是本地则需要SIMD
export const ocrCompatible = hasWasm && (isLocal ? hasSIMD : true)
// 识别器需要OCR，且不是Safari、Android、iOS，
export const scannerCompatible =
    hasGetDisplayMedia && hasPictureInPicture && !isSafari && !isAndroid && !isIOS && ocrCompatible
