import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServiceFinalService } from '../../services/login/service-final.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private userService = inject(ServiceFinalService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return !!this.userService.currentUser;
  }

  getCurrentUser() {
    return this.userService.currentUser;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
