import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(''); // 코드 내용
  const [language, setLanguage] = useState<string>('python'); // 언어 선택
  const [output, setOutput] = useState<string>(''); // 실행 결과

  const handleRun = async () => {
    try {
      const response = await axios.post('http://localhost:5000/run', { language, code });
      setOutput(response.data.output);
    } catch (error: any) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="editor-wrapper">
      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        style={{ marginBottom: '10px', padding: '5px' }}
      >
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="javascript">JavaScript</option>
      </select>

      <div className="editor">
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false }, // 미니맵 비활성화 (옵션)
          }}
        />
      </div>

      <button
        onClick={handleRun}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Run
      </button>

      <pre
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '150px',
        }}
      >
        {output}
      </pre>
    </div>
  );
};

export default App;
