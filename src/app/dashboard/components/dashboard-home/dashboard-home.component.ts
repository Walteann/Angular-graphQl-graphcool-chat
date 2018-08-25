import { AuthService } from './../../../core/services/auth.service';
import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
    selector: 'app-dashboard-home',
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent {

    constructor(
        private authService: AuthService
    ) { }

    onLogout(sidenav: MatSidenav) {
        sidenav.close()
            .then(() =>  {
                this.authService.logout();
            });
    }

}
