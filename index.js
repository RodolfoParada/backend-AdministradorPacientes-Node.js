import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import VeterinarioRoutes from './routers/veterinarioRoutes.js';
import PacienteRoutes from './routers/pacienteRoutes.js'

const app = express();
app.use(express.json());



dotenv.config();
conectarDB();
console.log(process.env.MONGO_URI);

// http://localhost:5173
const dominiosPermitidos = [process.env.FRONTEND_URL];

// const corsOptions = {
//     origin: function(origin, callback){
//     if(dominiosPermitidos.indexOf(origin) !== -1){
//         // El Origen del request esta permitido
//         callback(null, true)
//     }else {
//         callback(new Error('No permitido por CORS'))
//     }
//     }
// };

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || dominiosPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};


app.use(cors(corsOptions));

// app.use('/api', (req, res) => {
//     res.send('Hola Mundo');
// });

app.use('/api/veterinarios', VeterinarioRoutes);
app.use('/api/pacientes', PacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor esta corriendo en el puesto ${PORT}`);
});
