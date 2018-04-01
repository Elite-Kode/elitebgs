import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { State } from '@clr/angular';
import { Title } from '@angular/platform-browser';
import { StationsService } from '../../services/stations.service';
import { AuthenticationService } from '../../services/authentication.service';
import { IStation } from './station.interface';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSStationsV4WOHistory } from '../../typings';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-station-list',
    templateUrl: './station-list.component.html',
})
export class StationListComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    stationData: IStation[] = [];
    loading = true;
    stationToAdd: string;
    totalRecords = 0;
    private pageNumber = 1;
    private tableState: State;
    stationForm = new FormGroup({
        stationName: new FormControl()
    });
    constructor(
        private stationService: StationsService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Station Search - Elite BGS');
    }

    showStation(stations: EBGSStationsV4WOHistory) {
        this.totalRecords = stations.total;
        this.stationData = stations.docs.map(responseStation => {
            const id = responseStation._id;
            const name = responseStation.name;
            const type = FDevIDs.station[responseStation.type].name;
            const government = FDevIDs.government[responseStation.government].name;
            const allegiance = FDevIDs.superpower[responseStation.allegiance].name;
            const economy = FDevIDs.economy[responseStation.economy].name;
            const state = FDevIDs.state[responseStation.state].name;
            return <IStation>{
                id: id,
                name: name,
                type: type,
                government: government,
                allegiance: allegiance,
                economy: economy,
                state: state
            };
        });
    }

    refresh(tableState: State) {
        let beginsWith = this.stationForm.value.stationName;
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.stationService
            .getStationsBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(stations => this.showStation(stations));
        this.loading = false;
    }

    ngOnInit() {
        this.stationForm.valueChanges
            .debounceTime(300)
            .switchMap(value => {
                this.loading = true;
                this.pageNumber = Math.ceil((this.tableState.page.to + 1) / this.tableState.page.size);
                if (!value.stationName) {
                    value.stationName = '';
                }
                return this.stationService
                    .getStationsBegins(this.pageNumber.toString(), value.stationName)
            })
            .subscribe(stations => {
                this.showStation(stations);
                this.loading = false;
            });
    }
}
