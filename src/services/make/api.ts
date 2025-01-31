import express from 'express';
import cors from 'cors';
import { makeExifModule } from './makeExifModule';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/exif/artist', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        error: 'Image URL is required'
      });
    }

    const result = await makeExifModule({ imageUrl });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`EXIF API server running on port ${port}`);
});