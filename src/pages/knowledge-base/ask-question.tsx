import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  PageHeader,
  Textarea,
} from '@components';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rangeParser from 'parse-numeric-range';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);

interface FormData {
  title: string;
  description: string;
}

const initialState: FormData = {
  title: '',
  description: '',
};

const AskQuestion = () => {
  const { register, watch } = useForm<FormData>({
    defaultValues: initialState,
  });
  const syntaxTheme = oneDark;

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: any) {
      const hasLang = /language-(\w+)/.exec(className || '');
      const hasMeta = node?.data?.meta;

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/;
          const metadata = node.data.meta?.replace(/\s/g, '');
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)![1]
            : '0';
          const highlightLines = rangeParser(strlineNumbers as string);
          const highlight = highlightLines;
          const data: string | null = highlight.includes(applyHighlights)
            ? 'highlight'
            : null;
          return { data };
        } else {
          return {};
        }
      };

      return hasLang ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={hasLang[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          wrapLines={hasMeta}
          useInlineStyles={true}
          lineProps={applyHighlights}
        >
          {props.children}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} />
      );
    },
  };

  return (
    <div className={'flex flex-col gap-4'}>
      <PageHeader title={'Ask a question'} />
      <Card>
        <CardContent>
          <form className={'flex flex-col gap-4'}>
            <Input placeholder={'Title'} {...register('title')} />
            <div className={'grid grid-cols-2 gap-4'}>
              <Textarea
                placeholder={'Description'}
                rows={20}
                {...register('description')}
              />
              <Card>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {watch('description')}
                </ReactMarkdown>
              </Card>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AskQuestion;
