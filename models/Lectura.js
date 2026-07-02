const mongoose = require('mongoose');

const lecturaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
    heartRate: {
      type: Number,
      required: true,
      min: 0,
      max: 220,
    },
    acceleration: {
      type: Number,
      required: true,
    },
    petState: {
      type: String,
      enum: ['FELIZ', 'TRISTE', 'CANSADO', 'ENERGÉTICO', 'NORMAL'],
      default: 'NORMAL',
    },
    deviceInfo: {
      model: String,
      platform: String,
    },
  },
  {
    collection: 'lecturas',
    timestamps: {
      createdAt: false,
      updatedAt: false,
    },
  }
);

module.exports = mongoose.model('Lectura', lecturaSchema);
