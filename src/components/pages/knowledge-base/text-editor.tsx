import React, { FC, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';
import { EditorState, convertToRaw } from 'draft-js';
import dynamic from 'next/dynamic';
import { FieldError, UseFormSetValue } from 'react-hook-form';
import { AddKnowledgeFormData, InputWrapper } from '@components';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  {
    ssr: false,
  },
);

interface TextEditorProps {
  setValue: UseFormSetValue<AddKnowledgeFormData>;
  label?: string;
  info?: string;
  error?: FieldError;
}

export const TextEditor: FC<TextEditorProps> = ({
  setValue,
  error,
  label,
  info,
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markdown = draftToMarkdown(
      rawContentState,
      { trigger: '#', separator: ' ' },
      {},
      {
        blockTypesMapping: {
          'unordered-list-item': '* ',
        },
      },
    );
    setValue('content', markdown);
  };

  return (
    <InputWrapper error={error} label={label} info={info}>
      <Editor
        placeholder="Write your knowledge here..."
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />
    </InputWrapper>
  );
};
