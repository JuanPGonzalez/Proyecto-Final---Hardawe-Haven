import {Request} from "express";
import { User } from "../Model/user.entity";
export interface CustomRequest extends Request {
    id?: number;  
    tipoUsuario?: string; 
  }
export interface Payload {
    user:User
  }