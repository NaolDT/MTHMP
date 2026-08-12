const { Schema, model } = require('mongoose');

const ContentItemSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    source: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    externalId: { type: String, default: '' },
    publishedAt: { type: Date, default: null },
  },
  { _id: false }
);

const ContentCacheSchema = new Schema({
  key: { type: String, enum: ['research', 'insight', 'news'], required: true, unique: true },
  items: { type: [ContentItemSchema], default: [] },
  fetchedAt: { type: Date, required: true },
});

module.exports = model('ContentCache', ContentCacheSchema);