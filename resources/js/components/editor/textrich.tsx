'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import {
  LexicalComposer,
  InitialConfigType,
} from '@lexical/react/LexicalComposer';

import { $createRangeSelection, $setSelection, ParagraphNode, TextNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow';

import { ImageNode } from "@/components/editor/nodes/image-node";
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ContentEditable } from '@/components/editor/editor-ui/content-editable';

import { ToolbarPlugin } from '@/components/editor/plugins/toolbar/toolbar-plugin';
import { HistoryToolbarPlugin } from '@/components/editor/plugins/toolbar/history-toolbar-plugin';
import { BlockFormatDropDown } from '@/components/editor/plugins/toolbar/block-format-toolbar-plugin';
import { FormatParagraph } from '@/components/editor/plugins/toolbar/block-format/format-paragraph';
import { FormatHeading } from '@/components/editor/plugins/toolbar/block-format/format-heading';
import { FormatNumberedList } from '@/components/editor/plugins/toolbar/block-format/format-numbered-list';
import { FormatBulletedList } from '@/components/editor/plugins/toolbar/block-format/format-bulleted-list';
import { FormatCheckList } from '@/components/editor/plugins/toolbar/block-format/format-check-list';
import { FormatQuote } from '@/components/editor/plugins/toolbar/block-format/format-quote';

import { FontFamilyToolbarPlugin } from '@/components/editor/plugins/toolbar/font-family-toolbar-plugin';
import { FontSizeToolbarPlugin } from '@/components/editor/plugins/toolbar/font-size-toolbar-plugin';
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from '@/components/editor/plugins/toolbar/font-background-toolbar-plugin'
import { FontColorToolbarPlugin } from '@/components/editor/plugins/toolbar/font-color-toolbar-plugin'
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin"
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin"
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image"

import { ImagesPlugin } from "@/components/editor/plugins/images-plugin"
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin"
import { MaxLengthPlugin } from "@/components/editor/plugins/actions/max-length-plugin"
import { CharacterLimitPlugin } from "@/components/editor/plugins/actions/character-limit-plugin"
import { CounterCharacterPlugin } from "@/components/editor/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from '@/components/editor/plugins/actions/edit-mode-toggle-plugin'
import { ClearEditorActionPlugin } from "@/components/editor/plugins/actions/clear-editor-plugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"

import { $getRoot} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $createTextNode } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

const placeholder = 'Start typing...';

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: {
    // optional, bisa sesuaikan tema kamu
  },
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    ImageNode,
    OverflowNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

// Moved from BankSoalCreate - Convert file to base64
const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Moved from BankSoalCreate - Image Upload component
const ImageUpload = ({
  onUpload,
  uploaded,
  onClear,
  previewSrc,
}: {
  onUpload: (base64: string) => void;
  uploaded: boolean;
  onClear?: () => void;
  previewSrc?: string;
}) => {
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        onUpload(base64);
      } catch (err) {
        console.error('Gagal mengonversi gambar ke Base64:', err);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative inline-block">
        <label
          className={`flex items-center justify-center w-20 h-8 text-sm border-2 rounded-lg cursor-pointer transition-all ${
            uploaded ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {uploaded ? 'Change' : 'Images'}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
};

function LoadInitialContent({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (value && !hasLoaded) {
      setHasLoaded(true);
      editor.update(() => {
        const root = $getRoot();
        root.clear(); // Kosongkan root terlebih dahulu

        // Pastikan nilai yang dimasukkan tidak kosong atau hanya whitespace
        const cleanedValue = value.trim();

        if (cleanedValue) {
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(cleanedValue);
          paragraph.append(textNode);
          root.append(paragraph);

          const selection = $createRangeSelection();
          selection.anchor.set(textNode.getKey(), cleanedValue.length, 'text');
          selection.focus.set(textNode.getKey(), cleanedValue.length, 'text');
          $setSelection(selection);
        }
      });
    }
  }, [editor, value, hasLoaded]);

  return null;
}

type EditorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function Editor({value, onChange }: EditorProps) {
  const [, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  // Added for image upload functionality
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(true);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
  
      // Lewati trigger pertama kali jika masih inisialisasi
      if (!hasInitialized) {
        setHasInitialized(true);
        return;
      }
  
      if (onChange && !imageBase64) {
        onChange(text);
      }
    });
  };

  // Handle image upload
  const handleImageUpload = (base64: string) => {
    setImageBase64(base64);
    setImageUploaded(true);
    setShowEditor(false);
    
    // Pass the base64 image to parent component
    if (onChange) {
      const base64Only = base64.split(',')[1] || base64;
      onChange(base64Only);
    }
  };

  // Handle image clear
  const handleImageClear = () => {
    setImageBase64(null);
    setImageUploaded(false);
    setShowEditor(true);
    
    if (onChange) {
      onChange('');
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ToolbarPlugin>
        {() => (
          <div className="z-10 border-b bg-white dark:bg-background relative">
            <div className="flex gap-2 overflow-auto p-1">
              <HistoryToolbarPlugin />
              <BlockFormatDropDown>
                <FormatParagraph />
                <FormatHeading levels={['h1', 'h2', 'h3']} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatCheckList />
                <FormatQuote />
              </BlockFormatDropDown>
              <FontFamilyToolbarPlugin />
              <FontSizeToolbarPlugin />
              <FontFormatToolbarPlugin format="bold" />
              <FontFormatToolbarPlugin format="italic" />
              <FontFormatToolbarPlugin format="underline" />
              <FontFormatToolbarPlugin format="strikethrough" />
              <SubSuperToolbarPlugin />
              <LinkToolbarPlugin />
              <ClearFormattingToolbarPlugin />
              <FontColorToolbarPlugin />
              <FontBackgroundToolbarPlugin />
              {/* Added image upload button */}
              <ImageUpload 
                uploaded={imageUploaded}
                previewSrc={imageBase64 || undefined}
                onUpload={handleImageUpload}
                onClear={handleImageClear}
              />
            </div>
            <div className="flex gap-2 overflow-auto p-1">
              <ElementFormatToolbarPlugin />
            </div>
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        {showEditor ? (
          <>
            <RichTextPlugin
              contentEditable={
                <div className="" ref={onRef}>
                  <ContentEditable
                    placeholder={placeholder}
                    className="ContentEditable__root relative block min-h-72 overflow-auto px-8 py-4 focus:outline-none h-72"
                  />
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} />
            <LoadInitialContent value={value} />
          </>
        ) : (
          <div className="relative border rounded-lg p-2 bg-gray-50 min-h-72 h-72 flex items-center justify-center">
            <img src={imageBase64 || ''} alt="Preview Gambar" className="max-h-60 max-w-full mx-auto" />
            <button
              type="button"
              onClick={handleImageClear}
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full px-2 text-xs text-red-500 hover:bg-red-50"
            >
              ✕
            </button>
          </div>
        )}
        <ListPlugin />
        <CheckListPlugin />
        <HistoryPlugin />
        <ImagesPlugin />
        <ActionsPlugin>
          <div className="clear-both flex items-center justify-between border-t p-1 overflow-auto gap-2">
            <div className="flex justify-start flex-1">
              <MaxLengthPlugin maxLength={10000} />
              <CharacterLimitPlugin maxLength={10000} charset="UTF-16" />
            </div>
            <div>
              <CounterCharacterPlugin charset="UTF-16" />
            </div>
            <div className="flex justify-end flex-1">
              <EditModeTogglePlugin />
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </div>
          </div>
        </ActionsPlugin>
      </div>
    </LexicalComposer>
  );
}