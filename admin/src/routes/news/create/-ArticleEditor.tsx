import { BlockTypeSelect, listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin, type MDXEditorMethods } from '@mdxeditor/editor'
import {
  headingsPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useImperativeHandle, useRef } from 'react'
import "./articleEditor.css"

export interface ArticleEditorRef {
  getValue: () => string
}

export function ArticleEditor({
  ref,
}: {
  ref: React.RefObject<ArticleEditorRef | null>
}) {
  const editorRef = useRef<MDXEditorMethods>(null)

  useImperativeHandle(ref, () => ({
    getValue() {
      return editorRef.current?.getMarkdown() ?? ''
    },
  }))

  return (
    <div>
      <MDXEditor
        ref={editorRef}
        markdown="# Hello world"
        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          toolbarPlugin({
            toolbarClassName: 'my-classname',
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
              </>
            ),
          }),
        ]}
        className="dark-theme dark-editor"
      />
    </div>
  )
}
