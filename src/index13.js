import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE
import { mockWithImage,mockWithVideo } from "./libs/camera-mock.js"
import { CSS3DObject } from "./libs/CSS3DRenderer.js"

const createYoutube = async() => {
    return new Promise((resolve, reject) => {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName("script")[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

        const onYouTubeIframeAPIReady = () => {
            const player = new YT.Player("player", {
                videoId: "ynPvJxZ2INw",
                events: {
                    onReady: () => {
                        resolve(player)
                    }
                }
            })
        }
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        // mockWithImage("assets/mocks/mock.jpg")

        const player = await createYoutube()

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
            player.playVideo()
        }
        cssAnchor.onTargetLost = () => {
            console.log("on target lost")
            player.pauseVideo()
        }

        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            cssRenderer.render(cssScene, camera)
        })
    }

    start()
})