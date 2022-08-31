// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '前端笔记',
  tagline: 'Dinosaurs are cool',
  url: 'https://jser.online',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  themes: ['@docusaurus/theme-live-codeblock'],
  favicon: 'img/favicon.ico',
  organizationName: 'qhx0807', // Usually your GitHub org/user name.
  projectName: 'my-notebook', // Usually your repo name.
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/qhx0807/my-notebook/blob/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/qhx0807/my-notebook/blob/master',
          path: './blog',
          routeBasePath: '/',
          // blogSidebarTitle: '最近博客',
          postsPerPage: 10,
          blogSidebarCount: 10,
          // blogListComponent: require.resolve('./src/pages/list.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Jser.online',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.webp',
        },
        items: [
          // {to: '/', label: '博客', position: 'left'},
          // {to: '/blog', label: '工具合集', position: 'left'},
          {
            type: 'doc',
            docId: 'questions/questions',
            position: 'left',
            label: '每日一题',
          },
          {
            type: 'doc',
            docId: 'posts/posts',
            position: 'left',
            label: '进阶博文',
          },
          // {
          //   type: 'doc',
          //   docId: 'posts/algorithm',
          //   position: 'left',
          //   label: '算法',
          // },
          {
            href: 'https://github.com/qhx0807',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            items: [
              {
                html: `
                    <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer noopener" >
                    渝ICP备17007630号-4
                    </a>
                  `,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
