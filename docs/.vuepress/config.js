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
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '基础知识', link: '/guide/' },
      { text: '必会习题', link: '/questions/' },
      { text: 'Github', link: 'https://github.com/qhx0807' },
    ],
    sidebarDepth: 1,
    sidebar: {
      '/guide/': [
        {
          title: '^_^',
          path: '/guide/',
          collapsable: false,
          children: [
            '/guide/prototype',
            '/guide/context-and-stack',
            '/guide/one'
          ]
        },
      ],
      '/questions/': [
        ''
      ]
    }
  }
}
