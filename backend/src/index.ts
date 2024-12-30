import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(bodyParser.json());

interface RunRequest {
  language: string;
  code: string;
}

app.post('/run', (req: Request<{}, {}, RunRequest>, res: Response) => {
  const { language, code } = req.body;

  const tempFile = `temp.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js'}`;
  const command =
    language === 'python'
      ? `python3 ${tempFile}`
      : language === 'cpp'
      ? `g++ ${tempFile} -o temp && ./temp`
      : `node ${tempFile}`;

  fs.writeFileSync(tempFile, code);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.json({ output: stderr || error.message });
    } else {
      res.json({ output: stdout });
    }
    fs.unlinkSync(tempFile);
    if (language === 'cpp') fs.unlinkSync('temp');
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
