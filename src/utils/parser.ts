import { type HTMLElement, type Node, parse } from "node-html-parser";

export function parseHtml(html: string): HTMLElement {
  return parse(html);
}

export function isTextNode(node: Node): boolean {
  return node.nodeType === 3; // TEXT_NODE
}

export function isElement(node: Node): node is HTMLElement {
  return node.nodeType === 1; // ELEMENT_NODE
}

export function hasTextContent(element: HTMLElement): boolean {
  const text = element.text.trim();
  return text.length > 0;
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
