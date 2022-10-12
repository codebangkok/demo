import * as THREE from "./libs/three.module.js"

document.addEventListener("DOMContentLoaded", () => {
    const init = async () => {        
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera()
        const renderer = new THREE.WebGLRenderer({alpha: true})
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        document.body.appendChild(renderer.domElement)

        const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06)
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 0, -0.3)
        scene.add(mesh)
        
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        scene.add(light)

        let currentSession = null
        const start = async () => {
            currentSession = await navigator.xr.requestSession("immersive-ar", {
                optionalFeatures: ["dom-overlay"],
                domOverlay: {root: document.body}
            })
            
            renderer.xr.enabled = true
            renderer.xr.setReferenceSpaceType("local")
            await renderer.xr.setSession(currentSession)

            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera)
            })

            arButton.textContent = "End"
        }

        const end = async () => {
            currentSession.end()
            renderer.clear()
            renderer.setAnimationLoop(null)

            arButton.style.display = "none"
        }

        const arButton = document.querySelector("#ar-button")
        arButton.addEventListener("click", () => {
            if (currentSession) {
                end()
            } else {
                start()
            }
        })

        const supported = navigator.xr && await navigator.xr.isSessionSupported("immersive-ar")
        if (!supported) {
            arButton.textContent = "Not Supported"
            arButton.disabled = true               
        }
        
    }

    init()
})