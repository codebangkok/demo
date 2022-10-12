import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE
import { loadGLTF, loadAudio, loadVideo } from "./libs/loader.js"
import { mockWithImage } from "./libs/camera-mock.js"

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        // mockWithImage("assets/mocks/mock.jpg")

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: "assets/targets/sintel.mind"
        })

        const { renderer, scene, camera } = mindarThree

        const video = await loadVideo("assets/videos/sintel/sintel.mp4")        
        const videoTexture = new THREE.VideoTexture(video)

        const geometry = new THREE.PlaneGeometry(1,204/480)
        const material = new THREE.MeshBasicMaterial({map: videoTexture})
        const plane = new THREE.Mesh(geometry, material)

        const anchor = mindarThree.addAnchor(0)
        anchor.group.add(plane)
        
        anchor.onTargetFound = () => {
            video.play()
        }
        anchor.onTargetLost = () => {
            video.pause()
        }
        video.addEventListener("play", () => {
            video.currentTime = 6
        })

        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        })
    }

    start()
})