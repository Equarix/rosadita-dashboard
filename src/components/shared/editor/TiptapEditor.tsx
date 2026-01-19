import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@heroui/react";
import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuList,
  LuListOrdered,
  LuQuote,
  LuUndo,
  LuRedo,
  LuLink,
  LuUnlink,
} from "react-icons/lu";

interface TiptapEditorProps {
  content: any;
  onChange: (json: any) => void;
  editable?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-default-200 bg-default-50 rounded-t-lg">
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("bold") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleBold().run()}
      >
        <LuBold />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("italic") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleItalic().run()}
      >
        <LuItalic />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("strike") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleStrike().run()}
      >
        <LuStrikethrough />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("code") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleCode().run()}
      >
        <LuCode />
      </Button>

      <div className="w-px h-6 bg-default-300 mx-1 self-center" />

      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("heading", { level: 1 }) ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <LuHeading1 />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("heading", { level: 2 }) ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <LuHeading2 />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("bulletList") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleBulletList().run()}
      >
        <LuList />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("orderedList") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <LuListOrdered />
      </Button>

      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("blockquote") ? "solid" : "light"}
        onPress={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <LuQuote />
      </Button>

      <div className="w-px h-6 bg-default-300 mx-1 self-center" />

      <Button
        isIconOnly
        size="sm"
        variant={editor.isActive("link") ? "solid" : "light"}
        onPress={() => {
          const previousUrl = editor.getAttributes("link").href;
          if (previousUrl) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("URL", previousUrl);
          if (url === null) {
            return;
          }
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      >
        {editor.isActive("link") ? <LuUnlink /> : <LuLink />}
      </Button>

      <div className="w-px h-6 bg-default-300 mx-1 self-center" />

      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => editor.chain().focus().undo().run()}
        isDisabled={!editor.can().chain().focus().undo().run()}
      >
        <LuUndo />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => editor.chain().focus().redo().run()}
        isDisabled={!editor.can().chain().focus().redo().run()}
      >
        <LuRedo />
      </Button>
    </div>
  );
};

export default function TiptapEditor({
  content,
  onChange,
  editable = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[150px] p-4 text-foreground dark:prose-invert",
      },
    },
  });

  return (
    <div className="border border-default-200 rounded-lg shadow-sm">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
