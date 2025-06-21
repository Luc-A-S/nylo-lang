
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language = 'yaml' 
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
        wordWrap: 'on',
        lineNumbers: 'on',
        folding: true,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: false,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        bracketPairColorization: { enabled: true },
        guides: {
          indentation: true,
          bracketPairs: true
        },
        suggest: {
          enabled: true
        },
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        }
      }}
    />
  );
};

export default CodeEditor;
