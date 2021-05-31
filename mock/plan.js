const Mock = require('mockjs')
const List = []
const count = 10

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({ // 单个生成一个mock数据，然后循环push入list数组中
//     'id|+1': '1',
//     timestamp: +Mock.Random.date('T'),
//     author: '@first',
//     reviewer: '@first',
//     title: '@title(5, 10)',
//     studentCount: '@integer(1, 3)',
//     course: 'python办公自动化',
//     startTime: '@datetime',
//     imgPath: '..../../assets/views/plan/list-pic01.png',
//   }))
// }
// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({ // 一次性生成10条数据的数组，返回给list[]数组变量
//     'id|+1': 1, // 生成自增id -- 1开始
//     id: i + 1, // 生成自增id -- for循环的index索引版本
//     title: '@ctitle(5, 15)', // 生成计划名称
//     course: '@ctitle(5,10)', // 生成课程名
//     startTime: '@DATETIME("yyyy/MM/dd HH:mm:ss")', // 生成开始时间
//     // startTime: '@datetime()', // 生成开始时间
//     imgPath: `/views/plan/list-pic01.png`
//     // imgPath: (this) => {
//     //   let { id } = this;
//     //   return `/views/plan/list-pic0${id}.png`
//     // }
//   }))
// }
this.List = Mock.mock({
  'list|10': [{ // 一次性生成10条数据的数组，返回给list[]数组变量
      'id|+1': 1, // 生成自增id
      title: '@ctitle(5, 15)', // 生成计划名称
      course: '@ctitle(5,10)', // 生成课程名
      startTime: '@DATETIME("yyyy/MM/dd HH:mm:ss")', // 生成开始时间
      imgPath: '/views/plan/list-pic01.png'
  }]
})

module.exports = [
  {
    url: '/vue-element-admin/plan/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        // data: List
        data: this.List.list
        // data: Mock.mock({
        //   'list|10': [{ // 一次性生成10条数据的数组，返回给list[]数组变量
        //       id: '@increment()', // 生成自增id -- 101开始
        //       title: '@ctitle(5, 15)', // 生成计划名称
        //       course: '@ctitle(5,10)', // 生成课程名
        //       startTime: '@datetime', // 生成开始时间
        //       imgPath: `/views/plan/list-pic01.png`
        //   }]
        // })
      }
      // return {
      //   code: 20000,
      //   data: [
      //       {
      //         title: '我的考试计划1',
      //         studentCount: 349,
      //         course: 'python办公自动化',
      //         startTime: '2021/01/03 16:00:00',
      //         imgPath: '/views/plan/list-pic01.png'
      //       },
      //       { title: '我的考试计划2', studentCount: 351, course: 'Excel办公之年终实用技巧', startTime: '2021/01/02 16:00:00', imgPath: '/views/plan/list-pic02.png'},
      //       { title: '我的考试计划3', studentCount: 449, course: 'Power query全解析', startTime: '2021/01/04 16:00:00', imgPath: '/views/plan/list-pic03.png'},
      //       { title: '我的考试计划4', studentCount: 321, course: '小白装机课堂实战篇', startTime: '2021/01/01 16:00:00', imgPath: '/views/plan/list-pic04.png'},
      //       { title: '我的考试计划5', studentCount: 309, course: '从理论到实操教程', startTime: '2021/01/06 16:00:00', imgPath: '/views/plan/list-pic05.png'},
      //       { title: '我的考试计划6', studentCount: 449, course: 'Excel Office365 入门实战课堂', startTime: '2021/01/07 16:00:00', imgPath: '/views/plan/list-pic06.png'},
      //       { title: '我的考试计划7', studentCount: 569, course: '函数实战精讲', startTime: '2021/01/05 16:00:00', imgPath: '/views/plan/list-pic07.png'},
      //       { title: '我的考试计划8', studentCount: 719, course: '教你正确套模板', startTime: '2021/01/04 14:00:00', imgPath: '/views/plan/list-pic08.png'},
      //       { title: '我的考试计划9', studentCount: 129, course: '财务Excel', startTime: '2021/01/08 16:00:00', imgPath: '/views/plan/list-pic09.png'},
      //       { title: '我的考试计划10', studentCount: 229, course: 'Excel实用技巧', startTime: '2021/01/02 16:00:00', imgPath: '/views/plan/list-pic10.png'},
      //   ]
      //   // data: [
      //   //     { title: '我的考试计划1', studentCount: 349, course: 'python办公自动化', startTime: '2021/01/03 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划2', studentCount: 351, course: 'Excel办公之年终实用技巧', startTime: '2021/01/02 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划3', studentCount: 449, course: 'Power query全解析', startTime: '2021/01/04 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划4', studentCount: 321, course: '小白装机课堂实战篇', startTime: '2021/01/01 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划5', studentCount: 309, course: '从理论到实操教程', startTime: '2021/01/06 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划6', studentCount: 449, course: 'Excel Office365 入门实战课堂', startTime: '2021/01/07 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划7', studentCount: 569, course: '函数实战精讲', startTime: '2021/01/05 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划8', studentCount: 719, course: '教你正确套模板', startTime: '2021/01/04 14:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划9', studentCount: 129, course: '财务Excel', startTime: '2021/01/08 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   //     { title: '我的考试计划10', studentCount: 229, course: 'Excel实用技巧', startTime: '2021/01/02 16:00:00', imgPath: '../../assets/views/plan/list-pic01.png'},
      //   // ]
      // }
    }
  }
]
