import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js'
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

const registrar = async (req, res) => {
   const {email, nombre} = req.body;// siempre se va a leer datos de un formulario se usa req.body
  // console.log(nombre)
  // console.log(email)
  // console.log(password)

  // console.log(req.body);

  // Prevenir usuarios duplicados
const existeUsuario = await Veterinario.findOne({email})


if(existeUsuario){
 const error = new Error('Usuario ya registrado');
 return res.status(400).json({msg:error.message});

}

  try {
     //Guardar un nuevo veterinario
     const veterinario = new Veterinario(req.body);  
     const veterinarioGuardado = await veterinario.save();

     // Enviar el email
     emailRegistro({
      nombre,
      email,
      token: veterinarioGuardado.token
     })

     res.json(veterinarioGuardado);
    }catch (error) {
      console.log(error);
    }
};


const perfil = (req, res) => {
  const {veterinario} = req;
  res.json({perfin: veterinario});
};

const confirmar = async (req, res) =>{
  const  {token} = req.params; //siempre se va a leer con request params de la url
  const usuarioConfirmar = await Veterinario.findOne({token})

  if(!usuarioConfirmar){
    const error = new Error('Token no válido');
    return res.status(404).json({msg:error.message})
  }
 try{
   usuarioConfirmar.token = null;
   usuarioConfirmar.confirmado = true  
   await usuarioConfirmar.save()

   res.json({msg:'Usuario Confirmado Correctamente'});
 }catch{
  console.log(error)
 }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    console.log("Usuario no encontrado.");
    return res.status(403).json({ msg: "El usuario no existe" });
  }

  // Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    console.log("El usuario no ha confirmado su cuenta.");
    return res.status(403).json({ msg: "Tu cuenta no ha sido confirmada" });
  }

  // 🔍 Verificar la contraseña almacenada
  console.log("Contraseña almacenada en BD:", usuario.password);
  console.log("Contraseña ingresada:", password);

  // Revisar el password
  const passwordCorrecto = await usuario.comprobarPassword(password);

  console.log("Resultado de comparar contraseña:", passwordCorrecto);

  if (passwordCorrecto) {
    console.log("Contraseña correcta, autenticando...");
    return res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    console.log("Contraseña incorrecta.");
    return res.status(403).json({ msg: "El Password es incorrecto" });
  }
};


const olvidePassword = async (req,res)=>{
 const {email} = req.body; 

 const existeVeterinario = await Veterinario.findOne({email});
 if(!existeVeterinario){
  const error = new Error("El Usuario no existe");
  return res.status(400).json({msg: error.message});
 }
 try{
  existeVeterinario.token = generarId();
  await existeVeterinario.save();

  //Enviar Email con instrucciones
  emailOlvidePassword({
    email,
    nombre: existeVeterinario.nombre,
    token: existeVeterinario.token
  })


  res.json({msg: "Hemos enviado un email con las instrucciones"});

 }catch(error){
  console.log(error)
 }
}

const comprobarToken = async (req,res)=>{
  const {token} = req.params
  const tokenValido = await Veterinario.findOne({token});
 
  if(tokenValido){
    
    // Generar un nuevo token
    const veterinario = await Veterinario.findOne({token}); 
    const nuevoToken = generarJWT(veterinario._id);
    
    //El token es válido el usuario existe
    
    res.json({msg: "Token válido y el usuario existe", token: nuevoToken});
  }else{
    const error = new Error("Token no valido");
    return res.status(400).json({msg: error.message}); 

  }

}

const nuevoPassword = async (req,res)=>{
  const {token} = req.params; 
  const {password} = req.body; 

  const veterinario = await Veterinario.findOne({token}); 
 
  if(!veterinario){
    const error = new Error("Hubo un error");
    return res.status(400).json({msg: error.message});
  }

  try{
    veterinario.token = null; 
    veterinario.password = password; 
    await veterinario.save();

    // Generar un nuevo token
    const nuevoToken = generarJWT(veterinario._id);

    res.json({msg: "Password modificado correctamente", token: nuevoToken})
  }catch(error){
    console.log(error)
  }
}

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (veterinario.email !== req.body.email) {
    const existeEmail = await Veterinario.findOne({ email });

    if (existeEmail) {
      const error = new Error("Ese email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterianrioActualizado = await veterinario.save();
    res.json(veterianrioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  // Leer los datos
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body;

  // Comprobar que el veterinario existe
  const veterinario = await Veterinario.findById(id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar su password
  if (await veterinario.comprobarPassword(pwd_actual)) {
    // Almacenar el nuevo password

    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({ msg: "Password Almacenado Correctamente" });
  } else {
    const error = new Error("El Password Actual es Incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
  actualizarPassword,

}