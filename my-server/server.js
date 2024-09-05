const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/sharedocs';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const documentSchema = new mongoose.Schema({
  content: String
});
const Document = mongoose.model('Document', documentSchema);

app.get('/document', async (req, res) => {
  try {
    const document = await Document.findOne();
    if (document) {
      res.json(document);
    } else {
      res.status(404).send('Document not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/document', async (req, res) => {
  try {
    const { content } = req.body;
    let document = await Document.findOne();
    if (document) {
      document.content = content;
    } else {
      document = new Document({ content });
    }
    await document.save();
    res.status(200).send('Document saved');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
