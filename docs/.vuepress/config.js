module.exports = {
  title: '前端知识笔记',
  description: 'Just playing around',
  dest: '../dist',
  ga: '',
  evergreen: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'JavaScript基础', link: '/guide/' },
      { text: 'JavaScript进阶', link: 'https://google.com' },
    ],
    sidebarDepth: 1,
    sidebar: {
      '/guide/': [
        '',
        'one',
        'two',
      ]
    }
  }
}

// {
//   title: 'JavaScript基础',
//   collapsable: false,
//   children: ['/guide/']
// },
// {
//   title: 'JavaScript进阶',
//   collapsable: true,
//   children: ['/guide/']
// }