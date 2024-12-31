import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';

// Express 앱 초기화
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 요청과 응답 타입 정의
interface RunRequest {
  language: string;
  code: string;
}

interface RunResponse {
  output: string;
}

// 코드 실행 엔드포인트
app.post(
  '/run',
  (req: any, res: any) => {
    const { language, code } = req.body as RunRequest;

    // 임시 파일 이름 설정
    const tempFile = `temp.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js'}`;
    const execFile = `temp${language === 'cpp' ? '.exe' : ''}`;
    const command =
      language === 'python'
        ? `python3 ${tempFile}`
        : language === 'cpp'
        ? `g++ ${tempFile} -o temp && ./temp`
        : `node ${tempFile}`;

    try {
      // 임시 파일 생성
      fs.writeFileSync(tempFile, code);
    } catch (err) {
      return res.status(500).json({ output: `Failed to create temp file: ${(err as Error).message}` });
    }

    // 명령 실행
    exec(command, (error, stdout, stderr) => {
      try {
        if (error) {
          // 명령 실행 에러 처리
          res.status(400).json({ output: stderr || error.message });
        } else {
          // 명령 실행 성공
          res.json({ output: stdout });
        }
      } finally {
        // 임시 파일 삭제
        fs.unlinkSync(tempFile);
        if (language === 'cpp' && fs.existsSync(execFile)) {
          fs.unlinkSync(execFile);
        }
      }
    });
  }
);

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
