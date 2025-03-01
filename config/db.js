 import mongoose from 'mongoose';

//  const conectarDB = async () => {
//       try {
//          const db  = await mongoose.connect(process.env.MONGO_URI,{
//                useNewUrlParser: true,// version obsoleta
//               useUnifiedTopology: true,// version obsoleta
           
//           });
//           const url = `${db.connection.host}:${db.connection.port}`;
//           console.log(`Conectado a la base de datos en: ${url}`);
//       } catch (error) {
//           console.log(`error: ${error.message}`);
//           process.exit(1); // Detener la app
//       }
//   }

// export default conectarDB;

import mongoose from 'mongoose';

  const conectarDB = async () => {
      try {
          // Conexión a MongoDB
          const db = await mongoose.connect(process.env.MONGO_URI);
        

          // Formateo de la URL para confirmación
          const url = `${db.connection.host}:${db.connection.port}`;
          console.log(`Conectado a la base de datos en: ${url}`);
      } catch (error) {
          console.error(`Error al conectar a la base de datos: ${error.message}`);
          process.exit(1); // Detener la app en caso de error crítico
      }
  };

//  export default conectarDB;
