import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import Editor from 'rich-markdown-editor';
import { Document } from '../store/editor/types';

require('./Editor.scss');

export interface Props {
    markdown: string;
    // setText: (e: React.ChangeEvent<HTMLTextAreaElement>) => any;
    onSave: (doc: Document) => void;
    setMarkdown: (markdown: string) => void;
    readOnly?: boolean;
    activeIdx?: number;
}

const Markdown: React.FunctionComponent<Props> = ({ markdown, setMarkdown, onSave, readOnly = false, activeIdx=0}) => (
    <div className="markdown" id="editor">
        <Editor
            key={activeIdx}
            id="example"
            defaultValue={markdown}
            onSave={onSave}
            onCancel={() => console.log('Cancel triggered')}
            onChange={setMarkdown}
            readOnly={readOnly}
        />
    </div>
);

export default Markdown;
