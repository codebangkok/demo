import * as THREE from "./three.module.js"
import { ARButton } from "./ARButton.js"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const renderer = new THREE.WebGL1Renderer({ alpha: true })
renderer.xr.enabled = true
renderer.setAnimationLoop(() => {    
    renderer.render(scene, camera)
})

const arButton = ARButton.createButton(renderer)

document.body.appendChild(renderer.domElement)
document.body.appendChild(arButton)

const controller = renderer.xr.getController(0)
scene.add(controller)

controller.addEventListener("select", () => {
    const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06)
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.applyMatrix4(controller.matrixWorld)
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld)
    scene.add(mesh)
})