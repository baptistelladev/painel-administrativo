// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { AdminService } from '../services/firebase/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: Auth,
    private navCtrl: NavController,
    private adminService : AdminService
  ) {}

  canActivate(): Observable<boolean> {
    return authState(this.afAuth).pipe(
      take(1),
      switchMap(user => {
        if (user) {
          console.log(user);

          return from(this.adminService.getUserByUID(CollectionsEnum.ADMINS, user)).pipe(
            map((resp) => {
              if (resp) {
                return true
              } else {
                return false
              } // resp é true ou false baseado no resultado do getUserByUID
            })
          );
        } else {
          this.navCtrl.navigateRoot(['/login']);
          return of(false); // Usuário não autenticado
        }
      })
    );
  }
}
