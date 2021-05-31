<template>
    <div>
      <div id="container">
        <div class="statsWrapper"></div>
      </div>
    </div>
</template>
  
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            trackController: null,
            axes: null,
            geometry: null,
            spotLight: null
        }
    },
    mounted() {
        this.init()
        this.render()
        this.trackController.addEventListener('change', this.render)
    },
    methods: {
        init() {
            const container = document.querySelector('#container')
            this.initStats('.statsWrapper')

            // 实例化场景
            this.scene = new THREE.Scene()

            // 定义聚焦摄像机
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
            // 摄像机定位
            /**
             * 摄像机定位：
             * x轴： 是左右--是横向观察角度倾斜--左右观察便宜量，正值越大，观察角度就在右边距离越远，负值越大，观察角度就在物体的左边距离越远
             * y轴： 是高低--纵向观察角度倾斜--也就是观察角度的高低，正值越大，观察点越高，是俯视角度，从上往下观察，值为负数的话，就是从下往上观察，负值越大，距离下边距离越远
             * z轴： 是远近--拉开距离就给个大一点的值
             */
            this.camera.position.set(40, -10, 40)
            // this.camera.position.z = 30
            // 摄像机设置看点(为场景中心)
            this.camera.lookAt(this.scene.position)

            // 定义辅助坐标轴
            this.axes = new THREE.AxesHelper(20)
            this.scene.add(this.axes)

            // 定义聚光灯
            this.spotLight = new THREE.SpotLight(0xffffff)
            // 设置光源位置
            /**
             * 光源的位置：的设置其实跟摄像机的定位设置其实是同理，一理通百理明
             * x轴： 是左右--是横向观察角度倾斜--左右观察便宜量，正值越大，观察角度就在右边距离越远，负值越大，观察角度就在物体的左边距离越远
             * y轴： 是高低--纵向观察角度倾斜--也就是观察角度的高低，正值越大，观察点越高，是俯视角度，从上往下观察，值为负数的话，就是从下往上观察，负值越大，距离下边距离越远
             * z轴： 是远近--拉开距离就给个大一点的值
             * 光源还有一个要注意的是，其定位值在各个轴上都要大于摄像机的定位值，这样才能看到光源，否则无法感光(因为光只有在摄像机的后面，摄像机才能清晰看到物体的反光效果，否则光源若是跑到了物体的后面，挡住了光照，是问摄像机还怎么能看到反光呢？对吧)
             */
            this.spotLight.position.set(50, 40, 37.5)
            // 添加到场景
            this.scene.add(this.spotLight)

            // 绘制通用立方体
            // this.drawBoxGeometry()
            // 创建空的几何体对象
            this.drawBoxBufferGeometry()

            // 定义渲染器
            this.renderer = new THREE.WebGLRenderer()
            // 通过渲染器设置背景色
            this.renderer.setClearColor(0xEEEEEE, 1)
            // 通过渲染器设置自适应父元素尺寸
            this.renderer.setSize(container.clientWidth, container.clientHeight)
            // 渲染器中开启投影功能
            this.renderer.shadowMapEnabled = true
            // 添加渲染器到父DOM中
            container.appendChild(this.renderer.domElement)
            // 定义轨道控制器
            this.trackController = new OrbitControls(this.camera, this.renderer.domElement)
            console.log(this.scene);
        },
        render() {
            // 更新统计图
            this.$stats.update()
            // TODO
            this.renderer.render(this.scene, this.camera)
        },
        drawBoxBufferGeometry() {
            // 定义顶点集
            // 每六个坐标形成一个平面，6个平面(12个三角面--需要36个顶点)合并成封闭的一个立方形
            const vertices = new Float32Array([
            1,15,15,1,-15,15,1,15,-15,1,-15,15,1,-15,-15,1,15,-15,      // 第一个平面（左）--一个面有2个三角面构成--一个三角面由3个顶点构成，所以一行6个顶点的x,y,z坐标值，构成2个三角面，合并成一个4边平面
            -1,15,-15,-1,-15,-15,-1,15,15,-1,-15,-15,-1,-15,15,-1,15,15,// 第二个平面（右）
            -1,15,-15,-1,15,15,1,15,-15,-1,15,15,1,15,15,1,15,-15,	    // 第三个平面（后）
            -1,-15,15,-1,-15,-15,1,-15,15,-1,-15,-15,1,-15,-15,1,-15,15,// 第四个平面（前）
            -1,15,15,-1,-15,15,1,15,15,-1,-15,15,1,-15,15,1,15,15,	    // 第五个平面（下）
            1,15,-15,1,-15,-15,-1,15,-15,1,-15,-15,-1,-15,-15,-1,15,-15 // 第六个平面（上）--6个面总共需要36个顶点，每3个值(x,y,z值)为一个顶点位置
            ])
            // 创建空的几何体对象
            const geom = new THREE.BufferGeometry() // 只能用BufferGeometry()来代替
            // 给空的几何体对象赋值顶点集合
            geom.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ))
            //生成顶点Vertex法向量
            geom.computeVertexNormals()
            var material = new THREE.MeshLambertMaterial( { color: 0x0000ff } )
            // 自动渲染更新几何体三角面
            var mesh = new THREE.Mesh( geom, material )
            this.scene.add(mesh) // 只有网格对象才能添加到场景中，因为能添加到场景中的都是Object-3D的基类下面的子对象，几何体不是Object-3D的实例
        }
    }
}
</script>
  
<style scoped lang="scss">
#container {
    position: relative;
    height: 668px;
}
.statsWrapper {
    position: absolute;
    left: 0;
    min-height: 100px;
}
</style>
  