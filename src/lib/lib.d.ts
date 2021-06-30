declare module 'remark-highlight.js';

declare module "markdown-toc" {
  const toc: (markdown: string) => { content: string };
  export default toc;
}
