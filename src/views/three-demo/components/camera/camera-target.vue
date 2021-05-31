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
    OrbitControls,  
    MeshLambertMaterial, 
    OrthographicCamera, 
    PerspectiveCamera, 
    PlaneGeometry, 
    Vector3,
    SceneUtils,
    Dat
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
            perspective: 'Perspective',
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            positionX: -6,
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
        this.initStats('.stats-wrapper')
        this.initScene()
        this.initAxes()
        this.initGrid()
        this.initGUI()
        this.initCamera()
        // this.initOrthograpgicCamera()
        this.initSpotLight()
        this.drawPlane()
        this.drawCube()
        this.initRenderer()
        this.drawMultCube()
    },
    initScene() {
        this.scene = new THREE.Scene()
    },
    initCamera() {
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(this.cameraOptions.positionX, this.cameraOptions.positionY, this.cameraOptions.positionZ)
        // 摄像机初始角度设置----原来摄像机轨道控制器就是来通过鼠标来控制摄像机角度、位置和缩放的
        this.camera.rotation.x = this.cameraOptions.rotationX * Math.PI // rotation.x是表现是以x轴为中轴，摄像机镜头上下摆动，类似点头效果
        this.camera.rotation.y = this.cameraOptions.rotationY * Math.PI // rotation.y是表现是以y轴为中轴，摄像机镜头左右摆动，类似摇头效果
        this.camera.rotation.z = this.cameraOptions.rotationZ * Math.PI // rotation.z是表现是以z轴为中轴，摄像机镜头围绕z轴360度旋转，类似天旋地转的效果
        this.camera.lookAt(this.scene.position)
        this.cameraOptions.perspective = 'Perspective'
        this.$nextTick(() => this.render())
        
    },
    initOrthograpgicCamera() {
        this.camera = new OrthographicCamera(window.innerWidth / -30, window.innerWidth / 30, window.innerHeight / 30, window.innerHeight / -30, -200, 500)
        this.camera.position.set(this.cameraOptions.positionX, this.cameraOptions.positionY, this.cameraOptions.positionZ)
        this.camera.lookAt(this.scene.position)
        this.cameraOptions.perspective = 'Orthograpgic'
        this.$nextTick(() => this.render())
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
        this.addSpotLightOptions()
        this.addCameraOptions()
        this.$GUI.add(this, 'changeCamera')
        this.$GUI.add(this, 'lookAtTarget')
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
        const planeGeometry = new PlaneGeometry(100, 100, 1, 1)
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
        this.cube.name = 'cube'
        this.scene.add(this.cube)
    },
    drawMultCube() {
        const boxGeometryClone = this.boxGeometry.clone()
        const boxMultMaterials = [
            new MeshLambertMaterial({ color: 0xff44ff, opacity: 0.6, transparent: true }),
            new MeshLambertMaterial({ color: 0x000000, wireframe: true }),
            new MeshLambertMaterial({ color: 0x523318 }),
        ]
        const mesh = new SceneUtils.createMultiMaterialObject(boxGeometryClone, boxMultMaterials)
        mesh.children.forEach(it => {
            it.castShadow = true
        })
        mesh.children[0].position.set(20, 4, 6)
        mesh.children[1].position.copy(new THREE.Vector3(-20, 4, 9))
        mesh.children[2].position.copy(new THREE.Vector3(5, 4, -9))
        mesh.name = 'clone'
        this.scene.remove(this.scene.getObjectByName('clone'))
        this.scene.add(mesh)
        this.render()
    },

    /**
     * 添加光源参数到GUI
     */
    addSpotLightOptions() {
        const lightFolder = this.$GUI.addFolder('光源参数')
        lightFolder.add(this.spotLightOptions, 'spotX', -100, 100).onChange(v => {
            this.spotLightOptions.spotX = v
            this.updateSpotLightPosition()
        })
        lightFolder.add(this.spotLightOptions, 'spotY', -100, 100).onChange(v => {
            this.spotLightOptions.spotY = v
            this.updateSpotLightPosition()
        })
        lightFolder.add(this.spotLightOptions, 'spotZ', -100, 100).onChange(v => {
            this.spotLightOptions.spotZ = v
            this.updateSpotLightPosition()
        })
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
    /**
     * 添加摄像机参数到GUI
     */
    addCameraOptions() {
        const cameraFolder = this.$GUI.addFolder('镜头参数')
        cameraFolder.add(this.cameraOptions, 'positionX', -100, 100).onChange(v => {
            this.cameraOptions.positionX = v
            this.updateCameraOptions()
        })
        cameraFolder.add(this.cameraOptions, 'positionY', -100, 100).onChange(v => {
            this.cameraOptions.positionY = v
            this.updateCameraOptions()
        })
        cameraFolder.add(this.cameraOptions, 'positionZ', -100, 100).onChange(v => {
            this.cameraOptions.positionZ = v
            this.updateCameraOptions()
        })
        cameraFolder.add(this.cameraOptions, 'rotationX', -2, 2).onChange(v => {
            this.cameraOptions.rotationX = v * Math.PI
            this.updateCameraOptions()
        })
        cameraFolder.add(this.cameraOptions, 'rotationY', -2, 2).onChange(v => {
            this.cameraOptions.rotationY = v * Math.PI
            this.updateCameraOptions()
        })
        cameraFolder.add(this.cameraOptions, 'rotationZ', -2, 2).onChange(v => {
            this.cameraOptions.rotationZ = v * Math.PI
            this.updateCameraOptions()
        })
        this.cameraOptionsControls.perspectiveControl = this.$GUI.add(this.cameraOptions, 'perspective').listen()
        this.cameraOptionsControls.perspectiveControl.domElement.children[0].disabled="disabled"
        console.log('this.cameraOptionsControls: ', this.cameraOptionsControls.perspectiveControl) // 先选取一个变量：然后再按ctrl + shift + L即可
    },
    /**
     * 摄像机参数更新
     */
    updateCameraOptions() {
        this.camera.position.set(this.cameraOptions.positionX, this.cameraOptions.positionY, this.cameraOptions.positionZ)
        this.camera.rotation.set(this.cameraOptions.rotationX, this.cameraOptions.rotationY, this.cameraOptions.rotationZ)
        this.render()
    },
    /**
     * 切换摄像机镜头
     */
    changeCamera() {
        this.camera instanceof PerspectiveCamera ? this.initOrthograpgicCamera() : this.initCamera()
    },
    /**
     * 定位到cube立方体
     */
    lookAtTarget() {
        this.camera.lookAt(this.cube.position)
        // this.camera.lookAt(new Vector3(20, 5, 5))
        this.render()
    }
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
