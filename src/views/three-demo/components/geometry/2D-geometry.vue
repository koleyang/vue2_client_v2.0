<template>
    <div>
        <div id="container">
            <div class="stats-wrapper"></div>
            <div class="gui-wrapper"></div>
        </div>
    </div>
</template>

<script>
import { 
    THREE,
    PerspectiveCamera, 
    PlaneGeometry, 
    CircleGeometry,
    RingGeometry,
    Scene, 
    WebGLRenderer, 
    OrbitControls, 
    Dat, 
    AxesHelper, 
    GridHelper, 
    MeshLambertMaterial, 
    Mesh,
    AmbientLight,
    Color,
    SpotLight,
    PointLight
} from '../../../../lib/'

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
            circle: null,
            ring: null,
            spotLight: null,
            pointLight: null,
            ambientLight: null,
            orbitControls: null,
            spotLightOptions: { // GUI--管理光源配置对象
                spotX: 30,
                spotY: 50,
                spotZ: -80,
            },
            ambientLightOptions: {
                color: '#523318'
            },
            cameraOptions: {
                positionX: 0,
                positionY: 18,
                positionZ: 40,
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
            // this.initAmbientLight()
            this.initPointLight()
            this.initRenderer()
            this.drawPlane()
            this.drawCircle()
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
            // add
            this.addAmbientLightOptions()
            document.querySelector('.gui-wrapper').appendChild(this.$GUI.domElement)
        },
        initAmbientLight() {
            // this.ambientLight = new AmbientLight(0x523318)
            // this.ambientLight = new AmbientLight('#523318')
            this.ambientLight = new AmbientLight(this.ambientLightOptions.color)
            this.scene.add(this.ambientLight)
        },
        initPointLight() {
            this.pointLight = new PointLight(0xccffcc)
            this.pointLight.position.set(0, 20, 10)
            this.scene.add(this.pointLight)
        },
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
        drawPlane() {
            const planeGeometry = new PlaneGeometry(100, 100)
            const planeMaterial = new MeshLambertMaterial({ color: 0xcdcdcd, side: THREE.DoubleSide, })
            this.plane = new Mesh(planeGeometry, planeMaterial)
            this.plane.rotation.x = -0.5 * Math.PI // 翻转-90°，否则平面是竖直的。 不设置定位是表示以原点为中心，没有位置的偏移量。
            this.scene.add(this.plane)
        },
        drawCircle() {
            const circleGeometry = new CircleGeometry(15, 36) // 绘制半径为3,12个三角面的圆形
            const circleMaterial = new MeshLambertMaterial({ color: 0xdedede, side: THREE.DoubleSide, })
            this.circle = new Mesh(circleGeometry, circleMaterial)
            this.circle.rotation.x = -0.5 * Math.PI
            this.circle.position.set(0, 10, 0) 
            this.scene.add(this.circle)
        },
        /**
         * 添加环境光参数到GUI
         */
        addAmbientLightOptions() {
            const ambientFolder = this.$GUI.addFolder('环境光配置')
            ambientFolder.addColor(this.ambientLightOptions, 'color').onChange(v => {
                console.log('v: ', v)
                this.ambientLight.color = new Color(v)
                this.render()
            })
        },
    }
}
</script>

<style scoped lang="scss">

</style>
