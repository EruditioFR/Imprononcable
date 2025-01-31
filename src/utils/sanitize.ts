import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Structure
      'article', 'section', 'nav', 'aside', 'header', 'footer', 'main',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Text content
      'p', 'div', 'pre', 'blockquote', 'figure', 'figcaption',
      'hr', 'ol', 'ul', 'li', 'dl', 'dt', 'dd',
      // Text semantics
      'a', 'b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
      'code', 'kbd', 'samp', 'var', 'time', 'abbr',
      // Embedded content
      'img', 'iframe', 'video', 'audio', 'source', 'picture',
      // Table content
      'table', 'caption', 'colgroup', 'col', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
      // Forms
      'form', 'label', 'input', 'button', 'select', 'datalist', 'optgroup', 'option',
      'textarea', 'fieldset', 'legend', 'meter', 'progress',
      // Interactive elements
      'details', 'summary', 'dialog'
    ],
    ALLOWED_ATTR: [
      // Global attributes
      'id', 'class', 'lang', 'title', 'dir', 'role', 'tabindex',
      // Link attributes
      'href', 'target', 'rel', 'download',
      // Media attributes
      'src', 'alt', 'width', 'height', 'poster', 'controls', 'autoplay', 'muted', 'loop',
      // Table attributes
      'colspan', 'rowspan', 'headers',
      // Form attributes
      'type', 'name', 'value', 'checked', 'disabled', 'readonly', 'required',
      'placeholder', 'maxlength', 'minlength', 'min', 'max', 'step',
      // Style attributes
      'style',
      // ARIA attributes
      'aria-*', 'data-*'
    ],
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allowfullscreen'],
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick']
  });
}