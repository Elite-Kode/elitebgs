import { Component, OnInit } from '@angular/core';
import { State } from 'clarity-angular';
import { SystemsService } from './services/systems.service';
import { ISystem } from './system.interface';
import { FDevIDs } from './fdevids';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private systemData: ISystem[] = [];
    private loading = true;
    constructor(private systemService: SystemsService) { }

    refresh(tableState: State) {
        this.loading = true;
        this.systemService.getAllSystems().subscribe(systems => {
            this.systemData = systems.map(responseSystem => {
                const name = responseSystem.name;
                const government = FDevIDs.government[responseSystem.government].name;
                const allegiance = FDevIDs.superpower[responseSystem.allegiance].name;
                const primary_economy = FDevIDs.economy[responseSystem.primary_economy].name;
                const state = FDevIDs.state[responseSystem.state].name;
                return <ISystem>{
                    name: name,
                    government: government,
                    allegiance: allegiance,
                    primary_economy: primary_economy,
                    state: state
                };
            });
        });
    }

    ngOnInit() {
        // this.systemService.getAllSystems().subscribe(systems => {
        //     this.systemData = systems.map(responseSystem => {
        //         const name = responseSystem.name;
        //         const government = FDevIDs.government[responseSystem.government].name;
        //         const allegiance = FDevIDs.superpower[responseSystem.allegiance].name;
        //         const primary_economy = FDevIDs.economy[responseSystem.primary_economy].name;
        //         const state = FDevIDs.state[responseSystem.state].name;
        //         return <ISystem>{
        //             name: name,
        //             government: government,
        //             allegiance: allegiance,
        //             primary_economy: primary_economy,
        //             state: state
        //         };
        //     });
        // });
    }
}
