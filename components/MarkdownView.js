import React from "react";
import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeReact from "rehype-react";

const filterWhitespace = (node) =>
  !(typeof node === "string" && node.trim() === "");

const Table = ({ children, ...props }) => (
  <table {...props}>{children.filter(filterWhitespace)}</table>
);

const TableHead = ({ children, ...props }) => (
  <thead {...props}>{children.filter(filterWhitespace)}</thead>
);

const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children.filter(filterWhitespace)}</tbody>
);

const TableRow = ({ children, ...props }) => (
  <tr {...props}>{children.filter(filterWhitespace)}</tr>
);

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      table: Table,
      thead: TableHead,
      tbody: TableBody,
      tr: TableRow
    }
  });

const MarkdownView = ({ value }) => (
  <div>{processor.processSync(value).result}</div>
);

export default MarkdownView;
