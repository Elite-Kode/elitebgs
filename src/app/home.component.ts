import { Component, AfterViewInit, OnInit } from '@angular/core';
import { SystemsService } from './services/systems.service';
import { ISystem } from './system.interface';
import { FDevIDs } from './fdevids';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
    private systemData: ISystem[] = [];
    public config: any = {
        className: ['table-striped', 'table-bordered']
    };
    public rows: Array<any> = [];
    public columns: Array<any> = [
        { title: 'System Name', name: 'name' },
        { title: 'System Government', name: 'government' },
        { title: 'Allegiance', name: 'allegiance' },
        { title: 'Economy', name: 'primary_economy' },
        { title: 'State', name: 'state' }
    ];
    constructor(private systemService: SystemsService) { }

    ngOnInit() {
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
            this.rows = this.systemData;
        });
    }

    ngAfterViewInit() { }
}
