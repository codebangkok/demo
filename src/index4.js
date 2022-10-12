import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE
import { loadGLTF } from "./libs/loader.js"
import { mockWithImage, mockWithVideo } from "./libs/camera-mock.js"

// const loadGLTF = (path) => {
//     return new Promise((resolve, reject) => {
//         const loader = new GLTFLoader()
//         loader.load(path, (gltf) => {
//             resolve(gltf)
//         })
//     })
// }

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        // mockWithVideo("assets/mocks/mock.mp4")
        mockWithImage("assets/mocks/mock.jpg")

        const mindarThree = new  window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: "assets/targets/targets1.mind"
        })

        const { renderer, scene, camera } = mindarThree

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        scene.add(light)

        const anchor = mindarThree.addAnchor(0)

        const gltf = await loadGLTF("assets/models/musicband-raccoon/scene.gltf")
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        gltf.scene.position.set(0, -0.4, 0)
        anchor.group.add(gltf.scene)
        
        // const loader = new GLTFLoader()
        // loader.load("assets/models/musicband-raccoon/scene.gltf", (gltf) => {
        //     gltf.scene.scale.set(0.1, 0.1, 0.1)
        //     gltf.scene.position.set(0, -0.4, 0)
        //     anchor.group.add(gltf.scene)
        // })

        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        })
    }

    start()
})