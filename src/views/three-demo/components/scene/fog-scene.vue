<template>
    <div>
        <div id="container">
            <div id="statsWrapper"></div>
            <div id="guiWrapper"></div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Dat from 'dat.gui';

export default {
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            control: null,
            // GUI: null,
            step: 0,
            visualEdit: null,
            cube: null,
            axes: null,
            $GUI: null,
            plane: null, // 平面网格对象
            numberOfObjects: 0,
            numberOfObjectsControl: null,
            planeGeometry: null,
            planeMaterial: null,
            rotationSpeed: 0.02
        }
    },
    mounted() {
        this.init()
        this.render()
        // this.control.addEventListener('change', this.render)
    },
    methods: {
        init() {
            // 获取上下文环境
            const container = document.querySelector('#container')

            // this.GUI = this.initGUI()
            this.initGUI()
            this.initStats()
            // 实例化场景
            this.scene = new THREE.Scene()
            // 实例化摄像机,并设置摄像机位，并将场景中摄像机的定位赋给摄像机看点
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
            // this.camera.position.x = -30
            // this.camera.position.y = -30
            // this.camera.position.z = 60
            this.camera.position.set(5, -35, 20) // 摄像机的xyz值影响场景的倾斜角度调整
            this.camera.lookAt(this.scene.position) // 把摄像机的看点设置为场景中心
            // this.scene.add(this.camera)

            // 实例化坐标轴,并添加到场景
            this.axes = new THREE.AxesHelper(20)
            this.scene.add(this.axes)

            // 添加地板------------
            // 实例化平面几何体
            this.planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
            // 实例化平面暗调材质
            this.planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
            // 合并成地板网格对象
            this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
            // 添加地板到场景
            this.scene.add(this.plane)

            // 实例化环境光源，并添加到场景
            // const ambientLight = new THREE.AmbientLight(0x0c0c0c)
            // this.scene.add(ambientLight)

            // 添加聚光灯光源
            const spotLight = new THREE.SpotLight(0xffffff)
            // 设置光源位置
            spotLight.position.set(40, 20, 10) // 位置属性参数一般都是x,y,z轴相对数据
            // 聚光灯设置投射投影
            spotLight.castShadow = true
            // 添加光源到场景
            this.scene.add(spotLight)


            // 实例化渲染器
            this.renderer = new THREE.WebGLRenderer()
            // 通过渲染器设置背景色
            this.renderer.setClearColor(0xEEEEEE, 1)
            // 通过渲染器设置窗口自适应
            this.renderer.setSize(container.clientWidth, container.clientHeight)
            // 设置投影功能
            this.renderer.shadowMapEnabled = true
            // 把渲染器标签添加到上下文DOM环境中
            container.appendChild(this.renderer.domElement)

            // 定义摄像机轨道控制器控件
            this.control = new OrbitControls(this.camera, this.renderer.domElement)
            // 随机添加立方体
            for (let i = 0; i < 10; i++) {
                this.addCube()
            }
        },
        addCube() {
            let cubeSize = Math.ceil((Math.random() * 3))
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
            const cubeMeterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff})
            const cube = new THREE.Mesh(cubeGeometry, cubeMeterial)
            cube.castShadow = true
            cube.name = 'cube-' + this.scene.children.length
            // console.log(`地板宽度`, this.planeGeometry.parameters.width)
            // console.log(`地板高度`, this.planeGeometry.parameters.height)
            // console.log(`随机数`, Math.random())
            // console.log(`立方体x轴随机数${this.planeGeometry.parameters.width}`, Math.round(Math.random() * this.planeGeometry.parameters.width))
            // console.log(`立方体z轴随机数1`, Math.round(Math.random() * this.planeGeometry.parameters.height))
            // console.log(`立方体z轴随机数2`, Math.round(Math.random() * this.planeGeometry.parameters.height) - 20)
            // cube.position.x = 20 // x轴的值要在-20和正20之间才行
            let randomX = Math.round(Math.random() * this.planeGeometry.parameters.width) - 40
            // console.log(`X轴随机数`, randomX);
            randomX > -20 && randomX < 20 ? cube.position.x = randomX : cube.position.x = this.scene.children.length
            cube.position.y = 5
            // cube.position.z = 39 // 摄像机的这种角度，z轴不能设置为0或负数，否则立方体会跑到地板下面不可见
            let randomZ = Math.round(Math.random() * this.planeGeometry.parameters.height) - 20
            randomZ > 0 ? cube.position.z = randomZ : cube.position.z = 1
            // console.log(`立方体z轴`, randomZ);
            // cube.position.x = 30 + Math.round((Math.random() * this.planeGeometry.parameters.width))
            // cube.position.y = Math.round(Math.random() * 5)
            // // cube.position.z = -20 + Math.round((Math.random() * this.planeGeometry.parameters.height))
            // console.log(`打印立方体网格对象 =>`, cube)
            this.scene.add(cube)
            this.scene.fog = new THREE.FogExp2(0xffffff, 0.02) // 雾化场景：0xffffff是雾的颜色值，0.02是雾的浓度值
            this.scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }) // 全场景材质强制覆盖属性
            console.log(`打印场景,可看到场景中所有Mesh对象光源对象等 =>`, this.scene)
            this.render()
        },
        removeCube() {
            const lastObject = this.scene.children[this.scene.children.length - 1]
            lastObject instanceof THREE.Mesh ? this.scene.remove(lastObject) : null
            this.render()
        },
        render() {
            // 更新统计图
            this.$stats.update()
            this.control.addEventListener('change', this.render)
            this.numberOfObjects = this.scene.children.length
            this.scene.traverse(item => { // 针对场景中对象的全局遍历方法traverse()
                if (item instanceof THREE.Mesh && item != this.plane) { // 排除地板对象
                    item.rotation.x += this.rotationSpeed
                    item.rotation.y += this.rotationSpeed
                    item.rotation.z += this.rotationSpeed
                }
            })
            requestAnimationFrame(this.render)
            this.renderer.render(this.scene, this.camera)
        },
        initGUI() {
            this.$GUI = new Dat.GUI()
            // const gui = new this.$GUI.GUI()
            // const obj = {
            //     add: () => this.addCube(),
            //     remove: () => this.removeCube(),
            // }
            // gui.add(this, 'addCube')
            // gui.add(this, 'removeCube')
            // gui.add(this, 'numberOfObjects').listen()
            // document.querySelector('#guiWrapper').appendChild(gui.domElement)
            this.$GUI.add(this, 'addCube')
            this.$GUI.add(this, 'removeCube')
            this.$GUI.add(this, 'rotationSpeed', 0, 0.5) // 给立方体旋转速度设置 取值范围为0--0.5
            this.numberOfObjectsControl = this.$GUI.add(this, 'numberOfObjects').listen() // 获取输入框父级控件
            this.numberOfObjectsControl.domElement.children[0].disabled="disabled" // this.numberOfObjectsControl.domElement是个包裹input的div，里面children[0]才是input输入框
            document.querySelector('#guiWrapper').appendChild(this.$GUI.domElement)
            // return gui
        },
        initStats() {
            // const st = new Stats()
            this.$stats.setMode(0) // 0: 参数0表示选择查看帧数；1: 参数1表示选择查看时差
            this.$stats.domElement.style.position = 'absolute'
            this.$stats.domElement.style.left = '0px'
            this.$stats.domElement.style.top = '0px'
            document.querySelector('#statsWrapper').appendChild(this.$stats.domElement)
            // return st
        },
    }
}
</script>

<style scoped lang="scss">
#container {
    position: relative;
    height: 668px;
}
#statsWrapper{
    position: absolute;
    left: 0;
    min-height: 100px;
}
#guiWrapper{
    position: absolute;
    right: 0;
    min-height: 100px;
}
</style>
