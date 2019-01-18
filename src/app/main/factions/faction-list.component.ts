import { Component, OnInit, HostBinding, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { Title } from '@angular/platform-browser';
import { FactionsService } from '../../services/factions.service';
import { IFaction } from './faction.interface';
import { StringHandlers } from '../../utilities/stringHandlers';
import { EBGSFactionsWOHistory } from '../../typings';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-faction-list',
    templateUrl: './faction-list.component.html',
})
export class FactionListComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-area') contentArea = true;
    @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
    isAuthenticated: boolean;
    factionData: IFaction[] = [];
    loading = true;
    factionToAdd: string;
    totalRecords = 0;
    private pageNumber = 1;
    private tableState: ClrDatagridStateInterface;
    factionForm = new FormGroup({
        factionName: new FormControl()
    });
    constructor(
        private factionService: FactionsService,
        private titleService: Title,
        private themeService: ThemeService
    ) {
        this.titleService.setTitle('Faction Search - Elite BGS');
    }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    showFaction(factions: EBGSFactionsWOHistory) {
        this.totalRecords = factions.total;
        this.factionData = factions.docs.map(responseFaction => {
            const id = responseFaction._id;
            const name = responseFaction.name;
            const government = StringHandlers.titlify(responseFaction.government);
            const allegiance = StringHandlers.titlify(responseFaction.allegiance);
            return <IFaction>{
                id: id,
                name: name,
                government: government,
                allegiance: allegiance
            };
        });
    }

    refresh(tableState: ClrDatagridStateInterface) {
        let beginsWith = this.factionForm.value.factionName;
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.factionService
            .getFactionsBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(factions => this.showFaction(factions));
        this.loading = false;
    }

    ngOnInit() {
        this.factionForm.valueChanges
            .pipe(debounceTime(300))
            .pipe(switchMap(value => {
                this.loading = true;
                this.pageNumber = Math.ceil((this.tableState.page.to + 1) / this.tableState.page.size);
                if (!value.factionName) {
                    value.factionName = '';
                }
                return this.factionService
                    .getFactionsBegins(this.pageNumber.toString(), value.factionName)
            }))
            .subscribe(factions => {
                this.showFaction(factions);
                this.loading = false;
            });
    }
}
