import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/firebase/users.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IUSer } from 'src/app/shared/models/IUser';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  public usersResume: any[] = [
    {
      length: null,
      sub_title: 'contas',
      title: 'cadastradas',
      value: 'USUARIOS_CADASTRADOS'
    },
    {
      length: null,
      sub_title: 'contas',
      title: 'premium',
      value: 'USUARIOS_PREMIUM'
    },
    {
      length: null,
      sub_title: 'contas',
      title: 'free',
      value: 'USUARIOS_NAO_PREMIUM'
    }
  ]

  public users: IUSer[];
  public users$: Observable<IUSer[]>;
  public usersSubscription: Subscription;

  public FeaturesEnum = FeaturesEnum;

  constructor(
    private usersService : UsersService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  public async getUsers() {
    this.users$ = this.usersService
    .getUsersCollection(CollectionsEnum.USERS);

    this.usersSubscription = this.users$
    .subscribe( async (users: IUSer[]) => {
      this.users = users;

      this.defineResume(users);
    })
  }

  public defineResume(users: IUSer[]): void {
    this.usersResume.forEach((resume: any) => {
      if (resume.value === 'USUARIOS_CADASTRADOS') {
        resume.length = users.length;
      }

      if (resume.value === 'USUARIOS_PREMIUM') {
        resume.length = users.filter((user: IUSer) => {
          return user.premiumInfo.isPremium
        }).length
      }

      if (resume.value === 'USUARIOS_NAO_PREMIUM') {
        resume.length = users.filter((user: IUSer) => {
          return !user.premiumInfo.isPremium
        }).length
      }
    })
  }

}
