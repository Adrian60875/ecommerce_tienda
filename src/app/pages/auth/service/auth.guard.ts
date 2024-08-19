import { Injectable, inject } from '@angular/core'; // Importa los decoradores Injectable e inject de Angular.
import { CanActivateFn, Router } from '@angular/router'; // Importa CanActivateFn para definir una función guard y Router para la navegación.
import { AuthService } from './auth.service'; // Importa el servicio AuthService que maneja la autenticación.

@Injectable() // Marca la clase como un servicio que puede ser inyectado en otras clases.
export class PermisionAuth {
  constructor(
    public authService: AuthService, // Inyección del servicio de autenticación.
    public router: Router, // Inyección del servicio de enrutamiento.
  ) {}
  
  // Método que determina si la ruta puede ser activada o no.
  canActive(): boolean {
    // Si no hay un usuario autenticado o token, redirige al login y retorna false.
    if(!this.authService.user || !this.authService.token){
      this.router.navigateByUrl("/login");
      return false;
    }

    // Obtiene el token de autenticación.
    let token = this.authService.token;

    // Decodifica el token para obtener la fecha de expiración.
    let expiration = (JSON.parse(atob(token.split(".")[1]))).exp;

    // Si el token está expirado, cierra sesión y retorna false.
    if(Math.floor((new Date).getTime() / 1000) > expiration){
      this.authService.logout();
      return false;
    }

    // Si todo está en orden, permite la activación de la ruta.
    return true;
  }
}

// Define la función guard que inyecta el servicio PermisionAuth y llama al método canActive.
export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermisionAuth).canActive();
};
