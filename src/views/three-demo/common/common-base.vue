<template>
    <div>
        <div id="container">
            <div class="stats-wrapper"></div>
            <div class="gui-wrapper"></div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PerspectiveCamera, PlaneGeometry } from 'three'
import * as Dat from 'dat.gui'

export default {
data() {
    return {
        container: null,
        scene: null,
        camera: null,
        cameraControls: null,
        renderer: null,
        axes: null,
        grid: null,
        $GUI: null,
        plane: null,
        spotLight: null,
        orbitControls: null,
        boxGeometry: null,
        boxMaterial: null,
        cube: null,
        spotLightOptions: { // GUI--管理光源配置对象
            spotX: 30,
            spotY: 50,
            spotZ: -80,
        },
        cameraOptions: {
            positionX: -6,
            positionY: 18,
            positionZ: 40,
        }
    }
},
mounted() {
    this.init()
    this.render()
},
methods: {
    init() {
        this.container = document.querySelector('#container')
        this.initStats('.stats-wrapper')
        this.initScene()
        this.initCamera()
        this.initAxes()
        this.initGrid()
        this.initGUI()
        this.initSpotLight()
        this.drawPlane()
        this.drawCube()
        this.initRenderer()
    },
    initScene() {
        this.scene = new THREE.Scene()
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(this.cameraOptions.positionX, this.cameraOptions.positionY, this.cameraOptions.positionZ)
        this.camera.lookAt(this.scene.position)
    },
    initAxes() {
        this.axes = new THREE.AxesHelper(20)
        this.scene.add(this.axes)
    },
    initControls() {
        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement)
    },
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0xEEEEEE, 1)
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.shadowMapEnabled = true
        this.container.appendChild(this.renderer.domElement)
        this.initControls()
    },
    initSpotLight() {
        this.spotLight = new THREE.SpotLight(0xffffff)
        this.spotLight.position.set(this.spotLightOptions.spotX, this.spotLightOptions.spotY, this.spotLightOptions.spotZ)
        this.spotLight.castShadow = true
        this.scene.add(this.spotLight)
    },
    initGUI() {
        this.$GUI = new Dat.GUI()
        this.$GUI.add(this.spotLightOptions, 'spotX', -100, 100).onChange(v => {
            this.spotLightOptions.spotX = v
            this.updateSpotLightPosition()
        })
        this.$GUI.add(this.spotLightOptions, 'spotY', -100, 100).onChange(v => {
            this.spotLightOptions.spotY = v
            this.updateSpotLightPosition()
        })
        this.$GUI.add(this.spotLightOptions, 'spotZ', -100, 100).onChange(v => {
            this.spotLightOptions.spotZ = v
            this.updateSpotLightPosition()
        })
        this.$GUI.add(this.cameraOptions, 'positionX', -100, 100).onChange(v => {
            this.cameraOptions.positionX = v
            this.updateSpotLightPosition()
        })
        this.$GUI.add(this.cameraOptions, 'positionY', -100, 100).onChange(v => {
            this.cameraOptions.positionY = v
            this.updateSpotLightPosition()
        })
        this.$GUI.add(this.cameraOptions, 'positionZ', -100, 100).onChange(v => {
            this.cameraOptions.positionZ = v
            this.updateSpotLightPosition()
        })
        // this.$GUI.add(this, 'cloneGeometry')
        // this.$GUI.add(this, 'cloneMultipleMatrial')
        document.querySelector('.gui-wrapper').appendChild(this.$GUI.domElement)
    },
    initGrid() {
        this.grid = new THREE.GridHelper( 100, 60, 0x2C2C2C, 0x888888 )
        this.scene.add(this.grid)
    },
    render() {
        this.$stats.update()
        this.cameraControls.addEventListener('change', this.render)
        this.renderer.render(this.scene, this.camera)
    },
    drawPlane() {
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1)
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
        this.plane.rotation.x = -0.5 * Math.PI
        this.plane.position.set(0, 0, 0) // 以中心原点位置绘制地板
        this.plane.receiveShadow = true
        this.scene.add(this.plane)
    },
    drawCube() {
        this.boxGeometry = new THREE.BoxGeometry(5, 5, 5)
        this.boxMaterial = new THREE.MeshLambertMaterial({ color: 0xcecece })
        this.cube = new THREE.Mesh(this.boxGeometry, this.boxMaterial)
        this.cube.position.set(-10, 4, 6)
        this.cube.castShadow = true
        this.scene.add(this.cube)
    },

    /**
     * 聚光灯位置更新
     */
    updateSpotLightPosition() {
        // 值改变了，位置属性也要重新设置才能更新聚光灯位置
        this.spotLight.position.set(
            this.spotLightOptions.spotX, 
            this.spotLightOptions.spotY, 
            this.spotLightOptions.spotZ
        )
        // 聚光灯位置更新后一定要重新渲染画面才行，否则没有任何效果
        this.render()
    },
}
}
</script>

<style scoped lang="scss">
#container {
    position: relative;
    height: 668px;
}
.stats-wrapper{
    position: absolute;
    left: 0;
    min-height: 100px;
}
.gui-wrapper{
    position: absolute;
    right: 0;
    min-height: 100px;
}
</style>
