import * as THREE from 'three'
import { 
    Scene,
    OrthographicCamera, 
    PerspectiveCamera, 
    WebGLRenderer,
    Vector3,
    PlaneGeometry, 
    CircleGeometry,
    RingGeometry,
    BoxGeometry,
    MeshLambertMaterial, 
    Mesh,
    SpotLight,
    AmbientLight,
    PointLight,
    AxesHelper,
    GridHelper,
    Color
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'
import * as Dat from 'dat.gui'

export {
    THREE, // 总的THREE对象
    Scene, // 场景对象
    OrthographicCamera, // 摄像机正交投影对象
    PerspectiveCamera, // 摄像机透视投影对象
    WebGLRenderer, // 渲染器对象
    Vector3, // 顶点对象
    PlaneGeometry, // 平面二维几何体
    CircleGeometry, // 平面二维圆形
    RingGeometry, // 平面圆环
    BoxGeometry, // 立方体三维对象
    MeshLambertMaterial, // 感光材质--暗调感光材质
    Mesh, // 基础网格对象--合并几何体和材质
    SpotLight, // 聚光灯光源对象
    AmbientLight, // 环境光对象
    PointLight, // 点光源对象
    AxesHelper, // 辅助坐标轴对象 
    GridHelper, // 辅助网格线对象 例：new THREE.GridHelper( 100, 60, 0x2C2C2C, 0x888888 )
    OrbitControls, // 摄像机轨道控制器对象
    SceneUtils, // 场景工具库--联合材质方法就在里面
    Dat, // dat.gui编辑器控件对象
    Color, // THREE的颜色构造函数
}