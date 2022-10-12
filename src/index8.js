import * as THREE from "./libs/three.module.js"
// const THREE = window.MINDAR.IMAGE.THREE
import { loadGLTF, loadAudio } from "./libs/loader.js"
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
        raccoon.scene.userData.clickable = true

        const bear =  await loadGLTF("assets/models/musicband-bear/scene.gltf")
        bear.scene.scale.set(0.1, 0.1, 0.1)
        bear.scene.position.set(0, -0.4, 0)
        bear.scene.userData.clickable = true

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

        //Audio
        const audioListener = new THREE.AudioListener()
        camera.add(audioListener)

        const backgroundAudioClip = await loadAudio("assets/sounds/musicband-background.mp3")        
        const backgroundAudio = new THREE.PositionalAudio(audioListener)
        backgroundAudio.setBuffer(backgroundAudioClip)
        backgroundAudio.setRefDistance(100)        
        backgroundAudio.setLoop(true)
        raccoonAnchor.group.add(backgroundAudio)

        raccoonAnchor.onTargetFound = () => {
            console.log("on target found")
            backgroundAudio.play()
        }

        raccoonAnchor.onTargetLost = () => {
            console.log("on target lost")
            backgroundAudio.pause()
        }

        //Audio
        const drumAudioClip = await loadAudio("assets/sounds/musicband-drum-set.mp3")
        const drumAudio = new THREE.Audio(audioListener)
        drumAudio.setBuffer(drumAudioClip)

        const celloAudioClip = await loadAudio("assets/sounds/musicband-cello.mp3")
        const celloAudio = new THREE.Audio(audioListener)
        celloAudio.setBuffer(celloAudioClip)

        //User Interaction
        document.body.addEventListener("click", e => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1
            const mouseY = -1 * ((e.clientY / window.innerHeight) * 2 - 1)
            const mouse = new THREE.Vector2(mouseX, mouseY)

            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects(scene.children, true)
            if (intersects.length > 0) {
                let o = intersects[0].object
                while (o.parent && !o.userData.clickable) {                    
                    o = o.parent
                }
                if (o.userData.clickable) {
                    if (o === raccoon.scene) {
                        console.log("raccoon drum set")
                        drumAudio.play()
                    } else if (o === bear.scene) {
                        console.log("bear cello")
                        celloAudio.play()
                    }
                }
            }
        })

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