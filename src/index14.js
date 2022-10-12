import {mockWithVideo, mockWithImage} from "./libs/camera-mock.js"
import * as THREE from "./libs/three.module.js"

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {

        const mindarThree = new window.MINDAR.FACE.MindARThree({
            container: document.body,
        })

        const { renderer, scene, camera } = mindarThree

        const genometry = new THREE.SphereGeometry(0.1, 32, 16)
        const material = new THREE.MeshBasicMaterial( { color: 0x00ffff, transparent: true, opacity: 0.5 })
        const sphere = new THREE.Mesh(genometry, material)

        const anchor = mindarThree.addAnchor(1)
        anchor.group.add(sphere)

        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        })
    }

    start()
})