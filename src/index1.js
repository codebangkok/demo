import * as THREE from "./libs/three.module.js"

document.addEventListener("DOMContentLoaded", async () => {
    const scene = new THREE.Scene()     
    
    const geometry = new THREE.BoxGeometry(1,1,1)
    const material = new THREE.MeshBasicMaterial({color: 0x0000FF})
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0,0,-2)
    cube.rotation.set(0, Math.PI/4, 0)
    scene.add(cube)

    const camera = new THREE.PerspectiveCamera()
    camera.position.set(1,1,5)

    const renderer = new THREE.WebGLRenderer({alpha: true})
    renderer.setSize(500,500)   
    renderer.domElement.style.position = "absolute"
    renderer.render(scene, camera)    
    
    const video = document.createElement("video")    
    video.style.position = "absolute"
    video.style.width = renderer.domElement.width
    video.style.height = renderer.domElement.height        
    video.play()

    // const stream = await navigator.mediaDevices.getUserMedia({video: true})
    // video.srcObject = stream

    document.body.appendChild(video)
    document.body.appendChild(renderer.domElement)
})
