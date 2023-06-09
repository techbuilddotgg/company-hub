import React, { FC } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import dynamic from 'next/dynamic';
import { FieldError, UseFormSetValue } from 'react-hook-form';
import { AddKnowledgeFormData, InputWrapper } from '@components';
import { draftToMarkdown } from 'markdown-draft-js';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  {
    ssr: false,
  },
);

interface TextEditorProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  setValue: UseFormSetValue<AddKnowledgeFormData>;
  label?: string;
  info?: string;
  error?: FieldError;
  tooltip?: React.ReactNode;
}

export const TextEditor: FC<TextEditorProps> = ({
  setValue,
  error,
  label,
  info,
  editorState,
  setEditorState,
  tooltip,
}) => {
  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markdown = draftToMarkdown(rawContentState);
    setValue('content', markdown);
  };

  return (
    <InputWrapper error={error} label={label} info={info} tooltip={tooltip}>
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
