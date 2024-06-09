import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Digital Alchemy",
  tagline: "Automating with Typescript",
  favicon: "assets/cropped.jpg",

  // Set the production url of your site here
  url: "https://docs.digital-alchemy.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Digital-Alchemy-TS",
  projectName: "Digital Alchemy",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Enable showing last update time and author
          showLastUpdateTime: true,
          breadcrumbs: true,
          showLastUpdateAuthor: true,
          editUrl:
            "https://github.com/Digital-Alchemy-TS/documentation/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/Digital-Alchemy-TS/documentation/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  titleDelimiter: "🔮",

  themeConfig: {
    // Replace with your project's social card
    image: "img/cropped.jpg",
    navbar: {
      title: "Digital Alchemy",
      logo: {
        alt: "Digital Alchemy",
        src: "img/cropped.jpg",
      },
      items: [
        { to: "/core", label: "Core", position: "left" },
        { to: "/home-automation", label: "Home Automation", position: "left" },
        { to: "/automation-quickstart", label: "Quickstart", position: "left" },
        { to: "/support-libraries", label: "Utilities", position: "left" },
        { to: "/support-libraries", label: "Side Projects", position: "left" },
        {
          href: "https://github.com/Digital-Alchemy-TS",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/JkZ35Gv97Y",
            },
            {
              label: "HASS Community Guide",
              href: "https://community.home-assistant.io/t/building-automations-in-typescript-with-digital-alchemy/709902/4",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "Changelog",
              to: "/changelog",
            },
            {
              label: "GitHub Org",
              href: "https://github.com/Digital-Alchemy-TS",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Digital Alchemy. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
