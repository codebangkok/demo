import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE
import { loadGLTF } from "./libs/loader.js"
import { mockWithImage } from "./libs/camera-mock.js"

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        mockWithImage("assets/mocks/mock2.jpg")

        const mindarThree = new  window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: "assets/targets/targets2.mind",
            maxTrack: 2,
        })

        const { renderer, scene, camera } = mindarThree

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        scene.add(light)

        const raccoon = await loadGLTF("assets/models/musicband-raccoon/scene.gltf")
        raccoon.scene.scale.set(0.1, 0.1, 0.1)
        raccoon.scene.position.set(0, -0.4, 0)

        const bear =  await loadGLTF("assets/models/musicband-bear/scene.gltf")
        bear.scene.scale.set(0.1, 0.1, 0.1)
        bear.scene.position.set(0, -0.4, 0)

        const raccoonAnchor = mindarThree.addAnchor(0)
        raccoonAnchor.group.add(raccoon.scene)

        const bearAnchor = mindarThree.addAnchor(1)
        bearAnchor.group.add(bear.scene)

        //Animation
        const raccoonMixer = new THREE.AnimationMixer(raccoon.scene)
        const raccoonAction = raccoonMixer.clipAction(raccoon.animations[0])
        raccoonAction.play()

        const bearMixer = new THREE.AnimationMixer(bear.scene)
        const bearAction = bearMixer.clipAction(bear.animations[0])
        bearAction.play()

        const clock = new THREE.Clock()

        await mindarThree.start()
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta()

            raccoon.scene.rotation.set(0, raccoon.scene.rotation.y + delta, 0)
            bear.scene.rotation.set(0, bear.scene.rotation.y + delta, 0)

            raccoonMixer.update(delta)
            bearMixer.update(delta)
            renderer.render(scene, camera)
        })
    }

    start()
})