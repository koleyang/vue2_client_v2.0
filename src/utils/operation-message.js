import { Message } from 'element-ui'
export function success() {
  Message.success('操作成功')
}
export function failed(err) { // 有时会和request.js里面的响应拦截重合，所以failed函数的定义意义不大
  Message.error(`操作失败:${err.message}`, {
    duration: 20000
  })
}
