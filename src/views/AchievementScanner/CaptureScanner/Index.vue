<script lang="ts">
import { CocogoatWebControl } from '@/modules/webcontrol'
const webControl = new CocogoatWebControl()
import { IMatFromImageData, toCanvas } from '@/utils/IMat'
import { getScannerInstance } from '../scanner/scanner.worker'
const { scannerOnLine, scannerOnLine2, scannerOnImage, initPromise, workerCV, workerOCR } = getScannerInstance()
enum S {
    Fail = -1,
    Init = 0,
    Ready = 1,
    Request = 2,
    Wait = 3,
    Capture = 4,
    Processing = 5,
    Finish = 6,
}
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue-demi'
import FloatWindow from '@/components/FloatWindow2.vue'
import FloatContent from './FloatContent.vue'
import FloatContentB from './FloatContent2.vue'
import WebcontrolSwitch from './WebcontrolSwitch.vue'
import { send } from '../utils'
import delay from 'delay'
import FastQ from 'fastq'
import type { IAScannerData, IAScannerFaild, IAScannerLine } from '../scanner/scanner'
import type { Rect } from '@/utils/opencv'
import { useRoute } from 'vue-router'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faTriangleExclamation, faInternetExplorer)
import Loader from '../Common/Loader.vue'
import Footer from '../Common/Footer.vue'
import type { ICVMat } from '@/utils/cv'
import { measureLatency, tillChanged } from '@/utils/cv/measurement'
export default defineComponent({
    name: 'AchievementScanner',
    components: {
        FloatWindow,
        FloatContent,
        FloatContentB,
        WebcontrolSwitch,
        FooterComponent: Footer,
        Loader,
    },
    setup() {
        const route = useRoute()
        const webControlEnabled = ref(0)
        const isTop = window === parent
        const capture = ref(false)
        const results = ref([] as (IAScannerData | IAScannerFaild)[])
        const scanned = ref(0)
        const dup = ref(0)
        const recognized = computed(() => {
            return {
                success: results.value.filter((r) => r.success).length,
                fail: results.value.filter((r) => !r.success).length,
            }
        })
        const recoginzeWorker = async ({ line, thread }: { line: ICVMat | null; thread: boolean }) => {
            if (line) {
                let p = scannerOnLine
                if (thread && state.value === S.Processing) {
                    ocrQueue.concurrency = 2
                    p = scannerOnLine2
                }
                const r = await p(line)
                // 检查重复
                if (r.success) {
                    const r2 = results.value.find((i) => {
                        if (!i.success) return false
                        const n = i as IAScannerData
                        return n.achievement.id === r.achievement.id
                    })
                    if (!r.done || route.query.withImage) {
                        r.images = {
                            main: toCanvas(line).toDataURL(),
                        }
                    }
                    if (r2) {
                        dup.value++
                    } else {
                        results.value.push(r)
                    }
                } else {
                    r.images = {
                        main: toCanvas(line).toDataURL(),
                    }
                    results.value.push(r)
                    new Image().src = r.images.main
                }
            }
            if (state.value !== S.Processing) {
                await delay(400)
            }
        }
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        let firstLine: IAScannerLine | null = null
        let zeroTimes = 0
        const cvWorker = async ({ imageData, keepLastLine }: { imageData: ImageData; keepLastLine: boolean }) => {
            const lines = await scannerOnImage(IMatFromImageData(imageData), keepLastLine)
            const scannedVal = scanned.value
            const totalHeight = lines.reduce((a, b) => a + b.image.rows, 0)
            let linepos = 0
            for (const line of lines) {
                if (line.image.rows > ((totalHeight / lines.length) * 2) / 3) {
                    // block太少的，认为是半行
                    if (!firstLine || linepos < 2) {
                        firstLine = line
                        linepos++
                    }
                    ocrQueue.push({ line: line.image, thread: scanned.value % 2 === 0 })
                    scanned.value++
                }
            }
            if (keepLastLine) {
                ocrQueue.push({ line: null, thread: false })
            }

            if (webControlEnabled.value) {
                if (scannedVal === scanned.value) {
                    zeroTimes++
                } else {
                    zeroTimes = Math.max(0, zeroTimes - 1)
                }
                if (zeroTimes > 5) {
                    zeroTimes = 0
                    state.value = S.Processing
                    return
                }
            }
        }
        const ocrQueue = FastQ.promise(recoginzeWorker, 1)
        ocrQueue.drain = () => {
            if (state.value === S.Processing) {
                state.value = S.Finish
            }
        }
        const cvQueue = FastQ.promise(cvWorker, 1)
        const video = ref(null as unknown as HTMLVideoElement)
        const state = ref(S.Init)
        initPromise.then(() => {
            state.value = S.Ready
        })
        let captureStream: MediaStream | null = null
        const requestCapture = async () => {
            try {
                captureStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false,
                })
                video.value.srcObject = captureStream
                video.value.play()
                state.value = S.Wait
            } catch (err) {
                console.error('Error: ' + err)
                state.value = S.Fail
            }
        }
        const scannerLoop = async () => {
            tempCanvas.width = video.value.videoWidth
            tempCanvas.height = video.value.videoHeight
            let rect: Rect | null = null
            let clickPos = { x: 0, y: 0 }

            let webControlLatency = -1
            const doWebControl = async (doDelay = true) => {
                if (!rect) {
                    rect = await workerCV.getRect()
                }
                if (firstLine && rect) {
                    if (!clickPos.x || !clickPos.y) {
                        clickPos = await webControl.toAbsolute(
                            webControlEnabled.value,
                            rect.x,
                            rect.y + firstLine.y + (firstLine.image.rows * 2) / 3,
                            {
                                dx: tempCanvas.width,
                                dy: tempCanvas.height,
                            },
                        )
                    }
                    await webControl.SetCursorPos(clickPos.x, clickPos.y)
                    await webControl.mouse_event(webControl.MOUSEEVENTF_LEFTDOWN, 0, 0, 0)
                    await webControl.mouse_event(webControl.MOUSEEVENTF_LEFTUP, 0, 0, 0)
                    if (doDelay) {
                        await webControl.mouse_event(webControl.MOUSEEVENTF_WHEEL, 0, 0, -120, 11)
                    } else {
                        await webControl.mouse_event(webControl.MOUSEEVENTF_WHEEL, 0, 0, -120, 2)
                    }
                }
                if (doDelay) {
                    // wait sometime before capture
                    await delay(webControlLatency > 0 ? webControlLatency : 60)
                }
            }
            const doMeasure = async () => {
                console.log('->latency measurement start')
                const res = await measureLatency(
                    workerCV.diffCached,
                    () => {
                        let imageData = null as ImageData | null
                        while (!imageData) {
                            console.info('-> capture')
                            tempCtx && tempCtx.drawImage(video.value, 0, 0, tempCanvas.width, tempCanvas.height)
                            imageData = tempCtx && tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
                            if (!imageData) {
                                console.warn('->capture FAILD')
                            }
                        }
                        return IMatFromImageData(imageData)
                    },
                    () => {
                        return doWebControl(false)
                    },
                )
                console.log('->latency measurement done', res)
                webControlLatency = Math.min(130, Math.max(res.latency, 40))
            }
            let firstScroll = true
            while (state.value === S.Capture) {
                try {
                    let imageData = null as ImageData | null
                    while (!imageData) {
                        tempCtx && tempCtx.drawImage(video.value, 0, 0, tempCanvas.width, tempCanvas.height)
                        imageData = tempCtx && tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
                        if (!imageData) {
                            console.warn('->capture FAILD')
                            await delay(60)
                        }
                    }
                    cvQueue.push({ imageData, keepLastLine: false })
                    if (webControlEnabled.value) {
                        if (firstScroll) {
                            await delay(60)
                            await doWebControl(false)
                            await delay(100)
                            firstScroll = false
                        } else {
                            await (webControlLatency > 0 ? doWebControl() : doMeasure())
                        }
                    } else {
                        await tillChanged(
                            workerCV.diffCached,
                            () => {
                                let imageData = null as ImageData | null
                                while (!imageData) {
                                    console.info('-> wait for change')
                                    tempCtx && tempCtx.drawImage(video.value, 0, 0, tempCanvas.width, tempCanvas.height)
                                    imageData =
                                        tempCtx && tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
                                    if (!imageData) {
                                        console.warn('->capture FAILD')
                                    }
                                }
                                return IMatFromImageData(imageData)
                            },
                            {
                                interval: 150,
                            },
                        )
                        console.log('->changed')
                    }
                } catch (e) {
                    if (e instanceof Error && e.message === 'ECANCEL') {
                        state.value = S.Processing
                    }
                }
            }
        }
        watch(
            () => state.value,
            async () => {
                if (state.value === S.Ready) {
                    send('ready', null)
                    send('state', 'ready')
                }
                if (state.value === S.Capture) {
                    send('state', 'capture')
                    if (webControlEnabled.value) {
                        webControl.activeWindow(webControlEnabled.value)
                    }
                    console.log('capture')
                    scannerLoop()
                }
                if (state.value === S.Processing) {
                    tempCtx && tempCtx.drawImage(video.value, 0, 0, tempCanvas.width, tempCanvas.height)
                    const imageData = tempCtx && tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
                    if (imageData) {
                        cvQueue.push({ imageData, keepLastLine: true })
                    }
                    captureStream && captureStream.getTracks().forEach((track) => track.stop())
                    console.log('processing')
                    send('state', 'processing')
                    ocrQueue.resume()
                    if (webControlEnabled.value && webControl.hwnd) {
                        webControl.activeWindow(webControl.hwnd)
                    }
                }
                if (state.value === S.Finish) {
                    console.log('finish')
                    send('state', 'finish')
                    send('result', {
                        result: results.value,
                        dup: dup.value,
                    })
                }
            },
        )
        const reset = async () => {
            await Promise.all([workerCV.reset(), workerOCR.reset()])
            results.value = []
            scanned.value = 0
            dup.value = 0
            state.value = S.Ready
            firstLine = null
            zeroTimes = 0
        }
        const msgHandler = (ev: MessageEvent) => {
            const { event } = ev.data
            switch (event) {
                case 'reset':
                    reset()
                    break
                case 'start':
                    requestCapture()
                    break
            }
        }
        if (!isTop) {
            window.addEventListener('message', msgHandler)
            onBeforeUnmount(() => {
                window.removeEventListener('message', msgHandler)
            })
        }
        watch([scanned, recognized, dup], () => {
            send('progress', {
                scanned: scanned.value,
                ...recognized.value,
                dup: dup.value,
            })
        })
        return {
            S,
            state,
            video,
            requestCapture,
            results,
            scanned,
            recognized,
            capture,
            dup,
            isTop,
            reset,
            webControl,
            webControlEnabled,
        }
    },
})
</script>
<template>
    <main>
        <section v-if="state === S.Init">
            <Loader @done="state++" />
        </section>
        <section v-else>
            <video ref="video" style="display: none"></video>
            <div v-if="state < S.Wait" :class="$style.startPage">
                <h1 v-if="isTop">椰羊·成就扫描</h1>
                <button class="start" @click="requestCapture">开始</button>
                <webcontrol-switch v-model="webControlEnabled" :w="webControl" />
                <div class="desc">点击开始后，请按下图指示选择原神窗口以识别</div>
                <img src="@/assets/openscreenshare.png" alt="请参照图片开始抓屏" />
                <FooterComponent />
            </div>
            <float-window
                v-if="state === S.Wait || state === S.Capture"
                :width="250"
                :height="100"
                :class="$style.floatwindow"
                @exit="state = S.Processing"
            >
                <float-content-b
                    :capture="capture"
                    :state="state === S.Capture ? 1 : 0"
                    :success="recognized.success"
                    :fail="recognized.fail"
                    :scanned="scanned"
                    :duplicate="dup"
                    :webControlEnabled="webControlEnabled"
                />
            </float-window>
            <div v-if="state > S.Wait" :class="$style.statusInner">
                <div class="inline-status">
                    <float-content
                        :in-float="false"
                        :capture="false"
                        :state="1"
                        :success="recognized.success"
                        :fail="recognized.fail"
                        :scanned="scanned"
                        :duplicate="dup"
                        @click="state === S.Capture && (state = S.Processing)"
                    />
                </div>
                <div v-if="state === S.Capture" class="no-box">
                    {{ webControlEnabled ? '自动滚动进行中' : '请按悬浮窗提示滚动页面' }}
                </div>
                <div v-if="state > S.Capture" class="pbar">
                    <div class="pbar-bar" :class="{ finish: state === S.Finish }">
                        <div
                            class="pbar-bar-in"
                            :style="{ width: `${((recognized.success + recognized.fail + dup) / scanned) * 100}%` }"
                        ></div>
                        <div v-if="state === S.Finish" class="pbar-bar-text">完成</div>
                    </div>
                    <div v-if="state === S.Finish" class="restart" @click="reset">重新开始</div>
                </div>
            </div>
            <button
                v-if="state === S.Wait"
                style="display: block; margin: 0 auto; margin-top: 10vh"
                @click="state = S.Capture"
            >
                我已切换到成就页面（自动识别页面未完成）
                <template v-if="webControlEnabled">
                    <br />
                    点击后会自动切换到原神窗口并开始自动翻页，请确保已经完成页面切换再回来
                </template>
                <br />如没看到悬浮窗请点击窗口空白处
            </button>
            <div v-if="isTop" :class="$style.list">
                <div v-for="(i, a) in results" :key="a" class="item">
                    <div v-if="!i.success">
                        <img :src="i.images.main" />
                    </div>
                    <div v-else class="title">{{ i.achievement.name }} {{ i.date || '未完成' }}</div>
                </div>
            </div>
        </section>
    </main>
</template>
<style lang="scss" module>
.loader {
    width: 200px;
    padding-top: 40vh;
    color: #666;
    text-align: center;
    font-size: 14px;
    margin: 0 auto;
    :global {
        .loader-text {
            padding-top: 15px;
        }
        .cssload-loader {
            display: block;
            margin: 0 auto;
            width: 30px;
            height: 30px;
            position: relative;
            border: 3px solid #333;
            &:local {
                animation: scanner-cssload-loader 2.3s infinite ease;
            }
        }
        .cssload-loader-inner {
            vertical-align: top;
            display: inline-block;
            width: 100%;
            background-color: #333;
            &:local {
                animation: scanner-cssload-loader-inner 2.3s infinite ease-in;
            }
        }
        .loader-progress {
            width: 170px;
            height: 2px;
            background: #ddd;
            margin: 0 auto;
            margin-top: 20px;
            position: relative;
            .loader-progress-bar {
                width: 0;
                height: 100%;
                background: #777;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
        .loader-progress-text {
            font-size: 12px;
            position: relative;
            top: -12px;
            background: #fff;
            display: inline-block;
            padding: 0 4px;
        }
    }
}
.floatwindow {
    opacity: 0;
    position: absolute;
    top: -9999px;
    left: -9999px;
}
.status-inner {
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    position: absolute;
    top: 35vh;
    left: 0;
    right: 0;
    :global {
        .no-box {
            color: #409eff;
            margin-top: -23px;
            position: relative;
            z-index: 2;
            cursor: pointer;
            small {
                font-size: 13px;
                text-decoration: underline;
            }
        }
        .inline-status {
            width: 180px;
            height: 70px;
            zoom: 1.5;
            position: relative;
            user-select: none;
            margin: 0 auto;
            .icon {
                display: none;
            }
            .text {
                left: 0;
                .desc {
                    display: none;
                }
            }
        }
        .pbar {
            width: 230px;
            margin: 0 auto;
            margin-top: -15px;
            z-index: 2;
            position: relative;
            .pbar-bar {
                width: 230px;
                height: 30px;
                border: 1px solid #409eff;
                border-radius: 20px;
                position: relative;
                &.finish {
                    cursor: pointer;
                    transition: all 0.3s;
                    &:hover {
                        opacity: 0.8;
                    }
                }
            }
            .pbar-bar-in {
                height: 100%;
                background: #409eff;
                border-radius: 20px;
                transition: all 0.1s;
            }
            .pbar-bar-text {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                color: #fff;
                line-height: 30px;
                font-size: 14px;
            }
            .restart {
                color: #888;
                font-size: 13px;
                margin-top: 10px;
                cursor: pointer;
                &:hover {
                    color: #666;
                }
            }
        }
    }
}
.list {
    font-size: 12px;
    height: calc(100vh - 50px);
    overflow: overlay;
    overflow-x: hidden;
    img {
        max-width: 100%;
    }
}
.start-page {
    position: absolute;
    top: 10vh;
    right: 0;
    left: 0;
    :global {
        h1 {
            text-align: center;
            font-weight: normal;
        }
        img {
            display: block;
            margin: 0 auto;
            margin-top: 30px;
            width: 490px;
            max-width: 100%;
        }
        button.start {
            width: 200px;
            height: 55px;
            background: #333;
            border-radius: 55px;
            border: 0;
            color: #fff;
            display: block;
            margin: 0 auto;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
                opacity: 0.7;
            }
        }
        .desc {
            text-align: center;
            margin-top: 20px;
        }
    }
}
</style>
