import { AuthService } from './../core/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class AutoLoginGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        // console.log('autoLoginGuard ');
        return this.authService.isAuthenticated
            .pipe(
                tap(is => (is) ? this.router.navigate(['/dashboard']) : null),
                map(is => !is)
            );
    }
}
