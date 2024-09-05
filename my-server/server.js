const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sharedocs', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const documentSchema = new mongoose.Schema({
  content: String
});

const Document = mongoose.model('Document', documentSchema);

// Routes
app.get('/document', async (req, res) => {
  try {
    const doc = await Document.findOne();
    res.json(doc);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/document', async (req, res) => {
  try {
    const { content } = req.body;
    let doc = await Document.findOne();
    if (doc) {
      doc.content = content;
    } else {
      doc = new Document({ content });
    }
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
