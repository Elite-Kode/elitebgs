import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ToolbarService } from './shared/toolbar.service';
import { ToolbarButton } from './shared/toolbar-button';
import { SystemsService } from './services/systems.service';
import { ISystem } from './system.interface';
import { FDevIDs } from './fdevids';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
    toolbarButtons: ToolbarButton[];
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
    constructor(private toolbarService: ToolbarService, private systemService: SystemsService) { }

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

    ngAfterViewInit() {
        this.toolbarButtons = [
            new ToolbarButton('text', 'EDDB API', 'router', './api/eddb'),
            new ToolbarButton('text', 'Elite BGS API', 'router', './api/elitebgs')
        ];

        this.toolbarService.makeButtons(this.toolbarButtons);
        this.toolbarService.setTitle('Elite BGS');
        this.toolbarService.setShowBack(false);
    }
}
