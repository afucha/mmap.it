import * as React from 'react';
import reactMarkdown from 'react-markdown';

require('./Create.scss');

export interface Props {
    markdown: string;
}

const Markdown: React.FunctionComponent<Props> = ({ markdown }) => (
    <div className="markdown">
        {markdown}
        <ReactMarkdown source={markdown} />
    </div>
);

export default Markdown;
