<template>
    <div>
        <div id="container"></div>
    </div>
</template>

<script>
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
    data() {
        return {
            camera: null, // 摄像机
            scene: null, // 场景
            renderer: null, // 渲染器
            mesh: null, // 网格
            control: null // 鼠标控件对象
        }
    },
    methods: {
        init: function() {
            const container = document.getElementById('container')
            // 创建相机 并定位z轴位置
            this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
            this.camera.position.z = 1

            this.scene = new Three.Scene() // 创建场景

            const geometry = new Three.BoxGeometry(1, 0.5, 0.2) // 创建物体
            const material = new Three.MeshNormalMaterial() // 创建材质

            this.mesh = new Three.Mesh(geometry, material) // 创建网格
            this.scene.add(this.mesh) // 添加网格到场景

            this.renderer = new Three.WebGLRenderer({ antialias: true }) // 创建渲染器标签--{antialias: true} 渲染器设置别名属性为true，是因为要添加材质纹理
            this.renderer.setSize(container.clientWidth, container.clientHeight) // 自适应窗口大小变化
            container.appendChild(this.renderer.domElement) // 添加渲染器标签到DOM父标签中
            this.control = new OrbitControls(this.camera, this.renderer.domElement) // 最简单的控件对象创建
        },
        render() {
            this.renderer.render(this.scene, this.camera)
        },
    },
    mounted() {
        this.init()
        this.render()
        this.control.addEventListener('change', this.render)
    }
}
</script>

<style scoped lang="scss">
  #container {
    height: 400px;
  }
</style>
