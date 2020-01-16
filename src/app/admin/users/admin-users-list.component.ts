import { Component, HostBinding, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { IAdminUsers } from '../admin.interface';
import { ThemeService } from '../../services/theme.service';
import { EBGSUsers } from '../../typings';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-admin-users-list',
    templateUrl: './admin-users-list.component.html'
})
export class AdminUsersListComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-container') contentContainer = true;
    @ViewChild(ClrDatagrid, {static: false}) datagrid: ClrDatagrid;
    userData: IAdminUsers[] = [];
    totalRecords = 0;
    loading = true;
    private pageNumber = 1;
    private tableState: ClrDatagridStateInterface;
    userForm = new FormGroup({
        user: new FormControl()
    });
    constructor(
        private usersService: UsersService,
        private themeService: ThemeService
    ) { }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    showUser(users: EBGSUsers) {
        this.totalRecords = users.total;
        this.userData = users.docs.map(responseUser => {
            const id = responseUser._id;
            const username = responseUser.username;
            const access = responseUser.access;
            const discordId = responseUser.id;
            const discriminator = responseUser.discriminator;
            return <IAdminUsers>{
                id: id,
                username: username,
                access: access,
                discordId: discordId,
                discriminator: discriminator
            };
        });
    }

    refresh(tableState: ClrDatagridStateInterface) {
        let beginsWith = this.userForm.value.user;
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.usersService
            .getUsersBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(users => this.showUser(users));
        this.loading = false;
    }

    ngOnInit() {
        this.userForm.valueChanges
            .pipe(debounceTime(300))
            .pipe(switchMap(value => {
                this.loading = true;
                this.pageNumber = Math.ceil((this.tableState.page.to + 1) / this.tableState.page.size);
                if (!value.user) {
                    value.user = '';
                }
                return this.usersService
                    .getUsersBegins(this.pageNumber.toString(), value.user)
            }))
            .subscribe(users => {
                this.showUser(users);
                this.loading = false;
            });
    }
}
