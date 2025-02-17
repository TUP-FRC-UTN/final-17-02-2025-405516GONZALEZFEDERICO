import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../interfaces/interface-final';

@Injectable({
  providedIn: 'root'
})
export class ServiceFinalService {
  private readonly API_URL = 'https://679b8dc433d31684632448c9.mockapi.io/users';
  public currentUserr = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.initializeUserFromStorage();
  }

  private initializeUserFromStorage(): void {
    const id = localStorage.getItem('userId');
    const username = localStorage.getItem('userUsername');
    const password = localStorage.getItem('userPassword');
    const role = localStorage.getItem('userRole');

    if (id && username && password && role && 
        (role === 'admin' || role === 'student')) {
      const user: User = {
        id: Number(id),
        username,
        password,
        role: role as 'admin' | 'student'
      };
      this.currentUserr.next(user);
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('userUsername', user.username);
    localStorage.setItem('userPassword', user.password);
    localStorage.setItem('userRole', user.role);
  }

  get currentUser(): User | null {
    if (!this.currentUserr.value) {
      this.initializeUserFromStorage();
    }
    return this.currentUserr.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}?username=${username}&password=${password}`)
      .pipe(
        map(users => {
          const user = users[0];
          if (user) {
            this.saveUserToStorage(user);
            this.currentUserr.next(user);
            return user;
          }
          throw new Error('usuario o contraseña incorrectos');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userUsername');
    localStorage.removeItem('userPassword');
    localStorage.removeItem('userRole');
    this.currentUserr.next(null);
  }
}