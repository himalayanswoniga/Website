import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const BUTTONS = [
  { label: 'B', action: (e) => e.chain().focus().toggleBold().run(), isActive: (e) => e.isActive('bold') },
  { label: 'I', action: (e) => e.chain().focus().toggleItalic().run(), isActive: (e) => e.isActive('italic') },
  { label: 'H2', action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e) => e.isActive('heading', { level: 2 }) },
  { label: '“ ”', action: (e) => e.chain().focus().toggleBlockquote().run(), isActive: (e) => e.isActive('blockquote') },
  { label: '• List', action: (e) => e.chain().focus().toggleBulletList().run(), isActive: (e) => e.isActive('bulletList') },
  { label: '1. List', action: (e) => e.chain().focus().toggleOrderedList().run(), isActive: (e) => e.isActive('orderedList') },
];

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: content || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: 'blog-detail-content min-h-[240px] px-4 py-3 outline-none' },
    },
  });

  if (!editor) return null;

  function addImage() {
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  function addLink() {
    const url = window.prompt('Link URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="border border-forest/15 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-forest/10 p-2">
        {BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => btn.action(editor)}
            className={`px-2.5 py-1 text-xs font-semibold ${btn.isActive(editor) ? 'bg-forest text-cream' : 'text-forest hover:bg-cream-2'}`}
          >
            {btn.label}
          </button>
        ))}
        <button type="button" onClick={addLink} className="px-2.5 py-1 text-xs font-semibold text-forest hover:bg-cream-2">Link</button>
        <button type="button" onClick={addImage} className="px-2.5 py-1 text-xs font-semibold text-forest hover:bg-cream-2">Image</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
