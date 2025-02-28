import Paciente from '../models/Paciente.js'
import mongoose from 'mongoose';

// const agregarPaciente = async (req, res) => {
//      const paciente = new Paciente(req.body);
//      console.log(paciente)
//      console.log(req.veterinario)
//      paciente.veterinario = req.veterinario;
     

//      try{
//       const pacienteAlmacenado = await paciente.save()
//       res.json(pacienteAlmacenado);
//      }catch(error){
//          console.log(error)
//      }
//  };

const agregarPaciente = async (req, res) => {
    if (!req.veterinario) {
        return res.status(401).json({ msg: 'No autenticado' });
    }

    try {
        const pacienteExiste = await Paciente.findOne({ email: req.body.email });
        if (pacienteExiste) {
            return res.status(400).json({ msg: 'Paciente ya registrado con este email' });
        }

        const paciente = new Paciente(req.body);
        paciente.veterinario = req.veterinario._id;

        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).json({ msg: 'Email ya registrado' });
        } else {
            res.status(500).json({ msg: 'Error al agregar paciente' });
        }
    }
};



// const obtenerPacientes = async (req, res) => {
//  const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario._id);
//  res.json(pacientes);

// };

const obtenerPacientes = async (req, res) => {
    if (!req.veterinario) {
        return res.status(401).json({ msg: 'No autenticado' });
    }

    try {
        const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
        res.json(pacientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener pacientes' });
    }
};



const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
      console.log('paciente id',paciente._id)
    console.log("paciente veterinario", paciente.veterinario)
    if (!paciente) {
      return res.status(404).json({ msg: "No Encontrado" });
    }
  
     if (paciente._id.toString() !== paciente.veterinario.toString()) {
       return res.json({ msg: "Accion no válida" });
      }
  
      if(paciente){
          res.json(paciente);
      }
  };



 
//  const actualizarPaciente = async (req, res) => {
//     const {id} = req.params; 
//     const paciente = await Paciente.findById(id); 

//     if(!paciente){
//         res.status(404).json({msg: 'No Encontrado'})
//     }

//     if (paciente._id.toString() !== paciente.veterinario.toString()) {
//         return res.json({ msg: "Accion no válida" });
//        }

//     // Actualizar Paciente
//     paciente.nombre = req.body.nombre || paciente.nombre;
//     paciente.propietario = req.body.propietario || paciente.propietario;
//     paciente.email = req.body.email || paciente.email;
//     // paciente.fecha = req.body.fecha || paciente.fecha;
//     paciente.fecha = new Date(req.body.fecha);
//     paciente.sintomas = req.body.sintomas || paciente.sintomas;
//     try {
//         const pacienteActualizado = await paciente.save();
//         res.json(pacienteActualizado);
//     }catch(error){
//         console.log(error)
//         res.status(500).json({ msg: 'Error al actualizar el paciente' });
//     }
    
//  }

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({ msg: "No Encontrado" });
    }

    try {
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = new Date(req.body.fecha); // Convertir a objeto Date
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el paciente' });
    }
};

 const eliminarPaciente = async (req, res) => {
    const {id} = req.params; 
    // const paciente = await Paciente.findById(id); 
    const paciente = await Paciente.findByIdAndDelete(id);

    if(!paciente){
        res.status(404).json({msg: 'No Encontrado'})
    }

  
    if (paciente._id.toString() !== paciente.veterinario.toString()) {
        return res.json({ msg: "Accion no válida" });
       }

    try{
        await paciente.deleteOne();
        res.json({msg: "Paciente Eliminado"});
    }catch(error){
        console.log(error)
    }

 }

export {
       agregarPaciente, 
       obtenerPacientes,
       obtenerPaciente,
       actualizarPaciente,
       eliminarPaciente
       }