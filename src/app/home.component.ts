import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ToolbarService } from './shared/toolbar.service';
import { ToolbarButton } from './shared/toolbar-button';
import { SystemsService } from './services/systems.service';
import { ISystem } from './system.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
    toolbarButtons: ToolbarButton[];
    private systemData: ISystem[] = [];
    public rows: Array<any> = [];
    public columns: Array<any> = [
        { title: 'System Name', name: 'name' },
        { title: 'System Government', name: 'government' },
        { title: 'Allegiance', name: 'allegiance' },
        { title: 'Economy', name: 'primary_economy' },
        { title: 'State', name: 'state' },
        { title: 'Controlling Minor Faction', name: 'controlling_minor_faction' }
    ];
    constructor(private toolbarService: ToolbarService, private systemService: SystemsService) { }

    ngOnInit() {
        this.systemService.getAllSystems().subscribe(systems => {
            this.systemData = systems;
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
