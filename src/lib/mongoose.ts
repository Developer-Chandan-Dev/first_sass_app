import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Proper MongoDB URI validation (optional - only if required for compliance)
function validateMongoURI(uri: string): boolean {
  try {
    // Basic format validation
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      return false;
    }
    
    // For production, ensure we're not connecting to localhost/internal IPs
    // unless explicitly allowed (for development/testing)
    if (process.env.NODE_ENV === 'production') {
      // Allow MongoDB Atlas and other cloud providers
      const isCloudService = uri.includes('.mongodb.net') || 
                            uri.includes('mongodb-atlas') ||
                            uri.includes('mongodb+srv://');
      
      // Block clear localhost/internal connections in production
      const isLocalhost = uri.includes('localhost:') || 
                         uri.includes('127.0.0.1:') ||
                         uri.includes('192.168.') ||
                         uri.includes('10.') ||
                         uri.includes('172.16.') ||
                         uri.includes('172.17.') ||
                         uri.includes('172.18.') ||
                         uri.includes('172.19.') ||
                         uri.includes('172.20.') ||
                         uri.includes('172.21.') ||
                         uri.includes('172.22.') ||
                         uri.includes('172.23.') ||
                         uri.includes('172.24.') ||
                         uri.includes('172.25.') ||
                         uri.includes('172.26.') ||
                         uri.includes('172.27.') ||
                         uri.includes('172.28.') ||
                         uri.includes('172.29.') ||
                         uri.includes('172.30.') ||
                         uri.includes('172.31.');
      
      if (isLocalhost && !isCloudService) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

// Only validate if you have specific compliance requirements
if (process.env.VALIDATE_MONGODB_URI === 'true' && !validateMongoURI(MONGODB_URI)) {
  throw new Error('Invalid MongoDB URI configuration');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;