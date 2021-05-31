<template>
    <div>
        <div id="container">
            <div class="statsWrapper"></div>
            <div class="guiWrapper"></div>
        </div>
    </div>
</template>

<script>
import { 
    THREE, 
    OrbitControls,  
    SceneUtils,
    Dat
} from '../../../../lib/'

export default {
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            orbitControls: null,
            axes: null,
            $GUI: null,
            spotLight: null,
            geometry: null, // 对几何体进行克隆
            geoMaterial: null,
            boxGeometry: null,
            boxGeometryClone: null,
            plane: null,
            spotLightOptions: {
                spotX: 30,
                spotY: 50,
                spotZ: -80,
            }
        }
    },
    mounted() {
        this.init()
        this.render()
    },
    methods: {
        init() {
            const container = document.querySelector('#container')
            this.initStats('.statsWrapper')
            this.initGUI()
            // 创建场景
            this.scene = new THREE.Scene()

            // 创建摄像机--注意第一个参数，相机的角度(就是第一个参数45这个值，这个值越小，看物体越近)
            this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
            // 设置摄像机定位
            this.camera.position.set(-36, 40, -60)
            // 设置摄像机看点(以场景中心为看点)
            this.camera.lookAt(this.scene.position)

            // 创建坐标轴
            this.axes = new THREE.AxesHelper(20)
            this.scene.add(this.axes)

            // 创建地板
            this.drawPlane()

            // 绘制立方体
            this.drawBoxGeometry()

            // 打光
            this.createSpotLight()

            // 创建渲染器
            this.renderer = new THREE.WebGLRenderer()
            // 设置背景色
            this.renderer.setClearColor(0xEEEEEE, 1)
            // 设置自适应父元素
            this.renderer.setSize(container.clientWidth, container.clientHeight)
            // 开启渲染器的投影功能
            this.renderer.shadowMapEnabled = true
            // 添加渲染标签到父DOM
            container.appendChild(this.renderer.domElement)

            // 实例化轨道控件
            this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        },
        render() {
            this.$stats.update()
            this.orbitControls.addEventListener('change', this.render)
            this.renderer.render(this.scene, this.camera)
        },
        initGUI() {
            this.$GUI = new Dat.GUI()
            this.$GUI.add(this.spotLightOptions, 'spotX', -100, 100).onChange(v => {
                console.log(`new spotX value =>`, v)
                this.spotLightOptions.spotX = v
                this.updateSpotLightPosition()
            })
            this.$GUI.add(this.spotLightOptions, 'spotY', -100, 100).onChange(v => {
                console.log(`new spotY value =>`, v)
                this.spotLightOptions.spotY = v
                this.updateSpotLightPosition()
            })
            this.$GUI.add(this.spotLightOptions, 'spotZ', -100, 100).onChange(v => {
                console.log(`new spotZ value =>`, v)
                this.spotLightOptions.spotZ = v
                this.updateSpotLightPosition()
            })
            this.$GUI.add(this, 'cloneGeometry')
            this.$GUI.add(this, 'cloneMultipleMatrial')
            document.querySelector('.guiWrapper').appendChild(this.$GUI.domElement)
        },
        createSpotLight() {
            this.spotLight = new THREE.SpotLight(0xffffff)
            this.spotLight.position.set(this.spotLightOptions.spotX, this.spotLightOptions.spotY, this.spotLightOptions.spotZ)
            this.spotLight.castShadow = true // 开启聚光灯投影效果
            this.scene.add(this.spotLight)
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
            console.log('更新后的聚光灯位置 =>', this.spotLight.position) // 打印看到聚光灯位置值已经变化了
            // 聚光灯位置更新后一定要重新渲染画面才行，否则没有任何效果
            this.render()
        },
        drawPlane() {
            const planeGeometry = new THREE.PlaneGeometry(100, 50, 1, 1)
            const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
            this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
            // 设置平面网格的角度和位置
            this.plane.rotation.x = -0.5 * Math.PI // 设置平面角度
            this.plane.position.x = 15
            this.plane.position.y = 0
            this.plane.position.z = 0
            // 平面对象接收投影
            this.plane.receiveShadow = true
            this.scene.add(this.plane)
        },
        drawBoxGeometry() {
            // 绘制boxGeometry立方体
            this.geometry = new THREE.BoxGeometry(10, 10, 10)
            this.geoMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc })
            this.boxGeometry = new THREE.Mesh(this.geometry, this.geoMaterial)
            // 设置立方体网格的位置
            this.boxGeometry.rotation.x = 44
            this.boxGeometry.rotation.y = 44
            this.boxGeometry.rotation.z = 44
            this.boxGeometry.position.x = 10
            this.boxGeometry.position.y = 10
            this.boxGeometry.position.z = 0
            // 立方体设置投射投影
            this.boxGeometry.castShadow = true
            // 添加立方体网格对象到场景中
            this.scene.add(this.boxGeometry)
        },
        cloneGeometry() {
            // 克隆几何体
            const cloneGeo = this.geometry.clone()
            cloneGeo.translate(-10, 10, -10) // 几何体是由translate平移属性的(注意：网格对象是没有translate属性的)，克隆后平移不与原克隆对象重合
            const geoMaterial2 = new THREE.MeshLambertMaterial({ color: 0xEEEEEE })
            this.boxGeometryClone = new THREE.Mesh(cloneGeo, geoMaterial2)
            // 立方体设置投射投影
            this.boxGeometryClone.castShadow = true
            // 添加立方体网格对象到场景中
            this.scene.add(this.boxGeometryClone)
            // 重新渲染画面
            this.render()
        },
        cloneMultipleMatrial() {
            const cloneObj = this.geometry.clone()
            // 定义材质集合
            const materials = [
                new THREE.MeshLambertMaterial({ color: 0xff44ff, opacity: 0.6, transparent: true }), // 透明的紫色材质
                new THREE.MeshLambertMaterial({ color: 0x000000, wireframe: true }), // 黑色线框材质
            ]
            const mesh = new SceneUtils.createMultiMaterialObject(cloneObj, materials) // 这样写会让两个材质同时叠加到一个基本体上
            console.log('网格组对象 =>', mesh)
            mesh.children.forEach(it => {
                it.castShadow = true
            })
            mesh.children[0].position.set(30, 13, 9)
            // mesh.children[1].position = new THREE.Vector3(10, 3, 1)
            mesh.children[1].position.copy(new THREE.Vector3(-20, 13, 9))
            // 克隆后进行位移
            // mesh.translateOnAxis(new THREE.Vector3(-0.5, 0.4, -0.1), 30) // three.module.js?5a89:47751 THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead
            // 再次点击按钮时，要移除掉之前生成的克隆体
            mesh.name = 'clone'
            this.scene.remove(this.scene.getObjectByName('clone'))
            this.scene.add(mesh)
            // 重新渲染画面
            this.render()
        }
    },
    beforeDestroy() {
        this.$GUI = null
        this.spotLightOptions = {
            spotX: 30,
            spotY: 50,
            spotZ: -80,
        }
    },
}
</script>

<style scoped lang="scss">
#container {
    position: relative;
    height: 668px;
}
.statsWrapper{
    position: absolute;
    left: 0;
    min-height: 100px;
}
.guiWrapper{
    position: absolute;
    right: 0;
    min-height: 100px;
}
</style>
