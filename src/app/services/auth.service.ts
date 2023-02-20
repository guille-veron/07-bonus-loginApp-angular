import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apikey = 'AIzaSyDn4TJMfoLe7H6qYUEPBYke5AljzfLIaoc';
  userToken: string;

  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor(private http:HttpClient) { 
    this.leerToken();
  }

  logout(){
    localStorage.removeItem('token');
  }

  login(usuario:UsuarioModel){
    const authData = {
      ...usuario, //operador spred envia el objeto con sus propiedades
      returnSecureToke: true
    };
    return this.http.post(
      `${this.url}:signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(
      map(resp => {        
        this.guardarToken(resp['idToken']);
        return resp;
      })
      )
  }

  nuevoUsuario(usuario:UsuarioModel){
    const authData = {
      ...usuario, //operador spred envia el objeto con sus propiedades
      returnSecureToke: true
    };
    return this.http.post(
      `${this.url}:signUp?key=${this.apikey}`,
      authData
    ).pipe(
      map(resp => {       
        this.guardarToken(resp['idToken']);
        return resp;
      })
    )
  }

  private guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('token',idToken);

    let expire = new Date();
    expire.setSeconds(3600);
    localStorage.setItem('expire',expire.getTime().toString());
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado():boolean{
   if (this.userToken.length < 2){
     return false;
   }
   
   const expira = Number(localStorage.getItem('expire'));
   const expiraDate = new Date();
   expiraDate.setTime(expira);
   console.log(expiraDate.getTime());
   
   if (expiraDate > new Date()) {
     return true;
   } else {
     return false;
   }
  }
}
