import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/post-ai-content', (req, res) => {
  const { body } = req.body;
  if (!body || !body.postText) {
    return res.status(400).send('Invalid request body');
  }

  const postContent = {
    postText: body.postText,
    imageUrl: body.imageUrl || '',
  };

  const filePath = path.join(__dirname, 'src/pages/postContent/post.json');

  fs.writeFile(filePath, JSON.stringify(postContent, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Error writing file');
    }
    res.status(200).send('Content saved');
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
