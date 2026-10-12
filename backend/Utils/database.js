
const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

const connectToDatabase = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MongoDB connection URI is not configured')
    }

    await mongoose.connect(config.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    })

    logger.info('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
  }
}

connectToDatabase()

module.exports = mongoose
