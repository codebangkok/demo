import {mockWithVideo, mockWithImage} from "./libs/camera-mock.js"
import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {

        // navigator.mediaDevices.getUserMedia = () => {
        //     return new Promise((resolve, reject) => {
        //         const video = document.createElement("video")
        //         video.setAttribute("src", "target.mp4")
        //         video.setAttribute("loop", "")

        //         video.oncanplay = () => {
        //             video.play()
        //             resolve(video.captureStream())
        //         }
        //     })
        // }

        // mockWithVideo("assets/mock.mp4")
        // mockWithImage("assets/mocks/mock.jpg")

        const mindarThree = new  window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: "assets/targets/targets1.mind",
            // uiScanning: "#scanning",
            // uiLoading: "no"
        })

        const { renderer, scene, camera } = mindarThree
        const geometry = new THREE.PlaneGeometry(1,1)
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.5})
        const plane = new THREE.Mesh(geometry, material)

        const anchor = mindarThree.addAnchor(0)
        anchor.group.add(plane)

        //Event Handling
        anchor.onTargetFound = () => {
            console.log("on target found")
        }

        anchor.onTargetLost = () => {
            console.log("on target lost")
        }


        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        })
    }

    start()
})