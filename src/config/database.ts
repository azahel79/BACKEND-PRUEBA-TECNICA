import mongoose from 'mongoose';
import dns from 'dns';

// Configurar DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }

    await mongoose.connect(mongoURI);
    console.log(' Conectado a MongoDB Atlas');
  } catch (error) {
    console.error(' Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log(' Desconectado de MongoDB');
  } catch (error) {
    console.error(' Error al desconectar de MongoDB:', error);
  }
};