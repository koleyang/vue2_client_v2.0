<template>
    <div>
        <div id="webglOutput">
            <div id="statsWrapper"></div>
            <div id="dgWrapper"></div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as Stats from 'stats.js'
import * as dat from 'dat.gui';
// import { Mesh, MeshBasicMaterial } from 'three'

export default {
    data() {
        return {
            camera: null, // 摄像机
            scene: null, // 场景
            renderer: null, // 渲染器
            mesh: null, // 网格
            control: null, // 鼠标控件对象
            axes: null, // 坐标轴对象
            plane: null, // 平面网格对象
            cube: null, // 立方体网格对象
            sphere: null, // 球体网格对象
            stats: null, // 统计图对象stats
            GUI: null, // 可视化编辑器组件
            step: 0, // 弹跳球的步阶数
            visualEdit: null // 编辑器参数对象
        }
    },
    components: {

    },
    created() {
    },
    mounted() {
        this.init()
        this.render()
        this.control.addEventListener('change', this.render)
    },
    beforeDestroy() {
        this.GUI = null
        this.visualEdit = null
    },
    methods: {
        init() {
            const container = document.getElementById('webglOutput')
            // 初始化stats控件
            this.stats = this.initStats()
            this.GUI = this.initGUI()
           
            // 定义场景
            this.scene = new THREE.Scene()

            //定义摄像机--并设置摄像机的位置和看点
            /*
             *
             *   PerspectiveCamera(fov?: number, aspect?: number, near?: number, far?: number)有四个参数，我做一下简单介绍，详情可自行查阅相关资料。
             *   fov:眼球张开的角度，0°时相当于闭眼。
             *   aspect:可视区域横纵比。
             *   near:眼睛能看到的最近垂直距离。
             *   far：眼睛能看到的最远垂直距离。
             * 
             * */
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000) // 定义摄像机对象
            this.camera.position.x = -30 // 设置摄像机x轴位置
            this.camera.position.y = 40 // 设置摄像机x轴位置
            this.camera.position.z = 30 // 设置摄像机x轴位置
            this.camera.lookAt(this.scene.position) // 设置摄像机看点

            // 定义坐标轴
            this.axes = new THREE.AxesHelper(20)
            this.scene.add(this.axes)

            // 添加聚光灯光源
            const spotLight = new THREE.SpotLight(0xffffff)
            // 设置光源位置
            spotLight.position.set(-40, 60, -10) // 位置属性参数一般都是x,y,z轴相对数据
            // 聚光灯设置投射投影
            spotLight.castShadow = true
            // 添加光源到场景
            this.scene.add(spotLight)

            // 定义平面网格，设置位置，并添加到场景
            // 定义平面几何体
            /**
             * 
             *  PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
             *   是二维平面几何体，看上去是扁平的，因为它只有两个维度，给定宽高，即可创建这种几何体。
             *   **width **：沿着X轴的宽度，默认值为1
             *   height：沿着Y轴的高度，默认为1
             *   **widthSegments **：宽度分段数，默认为1
             *   heightSegments：高度分段数，默认为1
             */
            const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
            // 定义网格基础颜色材质
            // const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
            // 定义暗调材质
            const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
            // 合并平面几何体和材质到平面网格对象中
            this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
            // 设置平面网格的位置
            this.plane.rotation.x = -0.5 * Math.PI // 设置平面角度
            this.plane.position.x = 15
            this.plane.position.y = 0
            this.plane.position.z = 0
            // 平面对象接收投影
            this.plane.receiveShadow = true
            // 添加平面网格对象到场景中
            this.scene.add(this.plane)

            // 定义立方体网格，设置位置，并添加到场景
            // 定义立方体
            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4) // 参数：分别是长,宽,高
            // 定义颜色基础颜色线框材质
            // const cubeMeterial = new THREE.MeshBasicMaterial({
            //     color: 0xff0000,
            //     wireframe: true
            // })
            // 定义暗调材质
            const cubeMeterial = new THREE.MeshLambertMaterial({
                color: 0xff0000
            })
            // 合并立方体和材质到立方体网格对象中
            this.cube = new THREE.Mesh(cubeGeometry, cubeMeterial)
            // 设置立方体网格的位置
            this.cube.position.x = -4
            this.cube.position.y = 3
            this.cube.position.z = 0
            // 立方体设置投射投影
            this.cube.castShadow = true
            // 添加立方体网格对象到场景中
            this.scene.add(this.cube)


            // 定义球体网格，设置位置，并添加到场景
            // 定义球体
            const sphereGeometry = new THREE.SphereGeometry(4, 20, 20) // 参数：分别是半径radius, widthSegments--宽度分片, heightSegment--高度分片s
            // 定义颜色基础颜色线框材质
            // const sphereMeterial = new THREE.MeshBasicMaterial({
            //     color: 0x7777ff,
            //     wireframe: true
            // })
            // 定义暗调感光材质
            const sphereMeterial = new THREE.MeshLambertMaterial({
                color: 0x7777ff
            })
            // 合并球体和材质到球体网格对象中
            this.sphere = new THREE.Mesh(sphereGeometry, sphereMeterial)
            // 设置球体网格的位置
            this.sphere.position.x = 20
            this.sphere.position.y = 4
            this.sphere.position.z = 2
            // 球体设置投射投影
            this.sphere.castShadow = true
            // 添加球体网格对象到场景中
            this.scene.add(this.sphere)

             // 定义渲染器--设置背景色--设置自适应窗口尺寸
            this.renderer = new THREE.WebGLRenderer()
            // 设置背景色
            this.renderer.setClearColor(0xEEEEEE, 1)
            // 设置窗口自适应
            this.renderer.setSize(container.clientWidth, container.clientHeight)
            // 渲染器中开启投影功能
            this.renderer.shadowMapEnabled = true
            // 添加渲染器标签到DOM父标签中
            container.appendChild(this.renderer.domElement)

            // 定义鼠标控件control
            this.control = new OrbitControls(this.camera, this.renderer.domElement)

           

        },
        initStats() {
            const st = new Stats()
            st.setMode(0) // 0: 参数0表示选择查看帧数；1: 参数1表示选择查看时差
            st.domElement.style.position = 'absolute'
            st.domElement.style.right = '0px'
            st.domElement.style.float = 'right'
            st.domElement.style.top = '0px'
            document.querySelector('#statsWrapper').appendChild(st.domElement)
            return st
        },
        initGUI() {
             // 初始化GUI可视化编辑器实例
            const dg = new dat.GUI();
            // 实例化编辑器参数对象
            this.visualEdit = new Controls(0.02, 0.03)
            // 给GUI控件添加可编辑参数--this.visualEdit表示可视化编辑器对象
            dg.add(this.visualEdit, 'rotationSpeed', 0, 0.5) // 给立方体旋转速度设置 取值范围为0--0.5
            dg.add(this.visualEdit, 'bouncinqSpeed', 0, 0.5) // 给球体弹跳速度设置 取值范围为0--0.5
            const obj = { add: _ => this.btnClick()}
            dg.add(obj, 'add')
            document.querySelector('#dgWrapper').appendChild(dg.domElement)
            return dg
        },
        render() {
            // 更新统计图
            this.stats.update()
            // 旋转立方体
            this.cube.rotation.x += this.visualEdit.rotationSpeed
            this.cube.rotation.y += this.visualEdit.rotationSpeed
            this.cube.rotation.z += this.visualEdit.rotationSpeed
            // this.cube.rotation.x += 0.02
            // this.cube.rotation.y += 0.02
            // this.cube.rotation.z += 0.02
            // 旋转球体--没有很好的材质，效果不明显
            // this.sphere.rotation.x += 0.02
            // this.sphere.rotation.y += 0.02
            // this.sphere.rotation.z += 0.02

            // 弹跳球动画----让球体不断的变换位置
            this.step += this.visualEdit.bouncinqSpeed
            // this.step += 0.04
            this.sphere.position.x = 20 + (10 * Math.cos(this.step))
            this.sphere.position.y = 2 + (10 * Math.abs(Math.sin(this.step)))

            // 使用requestAnimationFrame()动画
            requestAnimationFrame(this.render)
            // 利用渲染器，渲染场景和摄像机
            this.renderer.render(this.scene, this.camera)
        },
        btnClick() {
            console.log('dat-gui 按钮点击响应');
        }

    }
}
class Controls {
  constructor(a, b){
     this.rotationSpeed = a;
     this.bouncinqSpeed = b;
     return this;
  }
}
// export default class ComponentA extends Vue {
//   // initial data
//   nameString = `ComponentA`    
  
//   // lifecycle hook
//   mounted () {
//   this.greet()
//   }

//   // computed
//   get computedMsg () {
//   return 'computed ' + this.nameString
//   }

//   // method
//   greet () {
//   console.log('greeting: ' + this.nameString)
//   }

// }
</script>

<style scoped lang="scss">
  #webglOutput {
    position: relative;
    height: 400px; /* 要想显示场景， 这个上下文容器的高度样式也是要有的，否则无法显示*/
  }
  #statsWrapper{
    position: absolute;
    left: 0;
    min-height: 100px;
  }
  #dgWrapper{
    position: absolute;
    right: 0;
    min-height: 100px;
  }
</style>
