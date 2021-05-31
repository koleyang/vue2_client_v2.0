<template>
    <div>
        <div id="container">
            <div class="stats-wrapper"></div>
            <div class="gui-wrapper"></div>
        </div>
    </div>
</template>

<script>
import { PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer, OrbitControls, Dat, AxesHelper, GridHelper, MeshLambertMaterial, Mesh} from '../../../lib/'

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
            spotLightOptions: { // GUI--管理光源配置对象
                spotX: 30,
                spotY: 50,
                spotZ: -80,
            },
            cameraOptions: {
                positionX: 0,
                positionY: 18,
                positionZ: 40,
            },
            cameraOptionsControls: {
                perspectiveControl: null,
            },
        }
    },
    mounted() {
        this.init()
        this.render()
    },
    methods: {
        init() {
            this.container = document.querySelector('#container')
            this.initScene()
            this.initCamera()
            this.initAxes()
            this.initGrid()
            this.initStats('.stats-wrapper')
            this.initGUI()
            this.initRenderer()
        },
        initScene() {
            this.scene = new Scene()
        },
        initCamera() {
            this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
            this.camera.position.set(this.cameraOptions.positionX, this.cameraOptions.positionY, this.cameraOptions.positionZ)
            this.camera.lookAt(this.scene.position)
        },
        initAxes() {
            this.axes = new AxesHelper(20)
            this.scene.add(this.axes)
        },
        initGrid() {
            this.grid = new GridHelper(100, 60, 0x2C2C2C, 0x888888)
            this.scene.add(this.grid)
        },
        initGUI() {
            this.$GUI = new Dat.GUI()
            // add TODO

            document.querySelector('.gui-wrapper').appendChild(this.$GUI.domElement)
        },
        initAmbientLight() {},
        initPointLight() {},
        initOrbitControls() {
            this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        },
        initRenderer() {
            this.renderer = new WebGLRenderer({ antialias: true }) // antialias: true--抗锯齿效果设置为有效
            this.renderer.setClearColor(0xEEEEEE, 1)
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
            this.renderer.shadowMapEnabled = true
            this.container.appendChild(this.renderer.domElement)
            this.initOrbitControls()
        },
        render() {
            this.$stats.update()
            this.orbitControls.addEventListener('change', this.render)
            this.renderer.render(this.scene, this.camera)
        },
        drawPlane() {}
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
