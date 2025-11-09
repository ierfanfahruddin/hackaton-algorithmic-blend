const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

class PostReceiverAgent {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.configure();
  }

  configure() {
    this.app.use(bodyParser.json());

    this.app.post('/post-ai-content', (req, res) => {
      const { body } = req.body;
      if (!body || !body.postText) {
        return res.status(400).send('Invalid request body');
      }

      const postContent = {
        postText: body.postText,
        imageUrl: body.imageUrl || '',
      };

      const filePath = path.join(__dirname, '../../../../social-media-dashboard/src/pages/postContent/post.json');

      fs.writeFile(filePath, JSON.stringify(postContent, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return res.status(500).send('Error writing file');
        }
        res.status(200).send('Content saved');
      });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`PostReceiverAgent listening on port ${this.port}`);
    });
  }
}

module.exports = PostReceiverAgent;
