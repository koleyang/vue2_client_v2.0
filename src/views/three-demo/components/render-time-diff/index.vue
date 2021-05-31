
<template>
    <div>
      <div id="container"></div>
    </div>
</template>

<script>
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'RenderTimeDiff',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      T0: null,
      T1: null,
    }
  },
  methods: {
    init: function() {
      const container = document.getElementById('container')
      // 创建相机 并定位z轴位置
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
      this.camera.position.z = 1

      this.scene = new Three.Scene() // 创建场景

      const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2) // 创建物体
      const material = new Three.MeshNormalMaterial() // 创建材质

      this.mesh = new Three.Mesh(geometry, material) // 创建网格
      this.scene.add(this.mesh) // 添加网格到场景

      this.renderer = new Three.WebGLRenderer({ antialias: true }) // 创建渲染器标签--{antialias: true} 渲染器设置别名属性为true，是因为要添加材质纹理
      this.renderer.setSize(container.clientWidth, container.clientHeight) // 自适应窗口大小变化
      container.appendChild(this.renderer.domElement) // 添加渲染器标签到DOM父标签中
      new OrbitControls(this.camera, this.renderer.domElement) // 最简单的控件对象创建
    },
    animate: function() { // 给出动画方法
      this.T1 = new Date()
      let t = this.T1 - this.T0
      console.log(`渲染时间差 =>`, t)
      console.log(`渲染频率 =>`, Math.round(1000 / t))
      this.T0 = this.T1
      requestAnimationFrame(this.animate) // 请求动画帧，递归调用动画方法，类似于setInterval效果，但是不是定时的动画，意思是：只要浏览器空闲就会执行这个请求的帧动画
      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.02
      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted() {
    this.init()
    this.T0 = new Date()
    this.animate()
  }
}
</script>
<style scoped>
  #container {
    height: 400px;
  }
</style>
