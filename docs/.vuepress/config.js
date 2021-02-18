module.exports = {
  title: '前端知识笔记',
  description: 'Just playing around',
  dest: 'dist',
  ga: '',
  evergreen: false,
  displayAllHeaders: true,
  activeHeaderLinks: false,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  plugins: {
    "vuepress-plugin-auto-sidebar": {}
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '基础知识', link: '/guide/' },
      { text: '经典题目', link: '/questions/' },
      { text: '性能优化', link: '/performance/' },
      { text: '算法', link: '/algorithm/' },
      { text: 'Github', link: 'https://github.com/qhx0807' },
    ],
    sidebarDepth: 1,
    sidebar: 'auto'
    // {
    //   '/guide/': [
    //     {
    //       title: 'JavaScript基础',
    //       path: '/guide',
    //       collapsable: false,
    //       children: [
    //         '/guide/prototype',
    //         '/guide/context-and-stack',
    //         '/guide/scope-and-scope-chain'
    //       ]
    //     },
    //   ],
    //   '/questions/': [
    //     ''
    //   ]
    // }
  }
}
