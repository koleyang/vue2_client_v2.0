import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

/****************************************************************
*require.context
*@param ('svg的目录', 是否需要迭代查看前面给出的目录下面有没有子目录, 正则匹配的svg图片的路径格式)
*/
const req = require.context('./svg', false, /\.svg$/)
console.log(req);
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
