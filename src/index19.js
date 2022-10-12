import * as THREE from "./libs/three.module.js"
import { ARButton } from "./libs/ARButton.js"

document.addEventListener("DOMContentLoaded", () => {
    const init = async () => {        
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera()
        const renderer = new THREE.WebGLRenderer({alpha: true})
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        scene.add(light)

        renderer.xr.enabled = true
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
        })

        const arButton = ARButton.createButton(renderer, {
            optionalFeatures: ["dom-overlay"],
            domOverlay: {root: document.body}
        })
        document.body.appendChild(renderer.domElement)
        document.body.appendChild(arButton)

        const controller = renderer.xr.getController(0)
        scene.add(controller)
  
        controller.addEventListener("selectstart", () => {
        })

        controller.addEventListener("selectend", () => {  
        })

        controller.addEventListener("select", () => {
            const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06)
            const material = new THREE.MeshBasicMaterial({color:0xffffff * Math.random()})
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.applyMatrix4(controller.matrixWorld)
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld)
            scene.add(mesh)
        })
        
        
        
    }

    init()
})