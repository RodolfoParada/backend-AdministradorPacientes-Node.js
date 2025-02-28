import jwt from "jsonwebtoken";

 const generarJWT = (id) =>{
   return jwt.sign({id}, process.env.JWT_SECRET,{
     expiresIn: "30d",// 30 dias para volver a autetificar
   });
 };


export default generarJWT;
