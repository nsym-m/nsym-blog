declare module "markdown-toc" {
  const toc: (markdown: string) => { content: string };
  export default toc;
}

declare module 'remark-shiki';
