import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE
import { mockWithImage,mockWithVideo } from "./libs/camera-mock.js"
import { CSS3DObject } from "./libs/CSS3DRenderer.js"

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        // mockWithImage("assets/mocks/mock.jpg")

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: "assets/targets/targets1.mind"
        })

        const { renderer, scene, camera, cssRenderer, cssScene } = mindarThree        

        const arDiv = new CSS3DObject(document.querySelector("#ar-div"))              
        const cssAnchor = mindarThree.addCSSAnchor(0)        
        cssAnchor.group.add(arDiv)        

        cssAnchor.onTargetFound = () => {
            console.log("on target found")
        }
        cssAnchor.onTargetLost = () => {
            console.log("on target lost")
        }

        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            cssRenderer.render(cssScene, camera)
        })
    }

    start()
})