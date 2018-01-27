import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSStationV4Schema } from '../../typings';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep'
import { FDevIDs } from '../../utilities/fdevids';
import { ServerService } from '../../services/server.service';

@Component({
    selector: 'app-station-edit',
    templateUrl: './station-edit.component.html',
    styleUrls: ['./station-edit.component.scss']
})
export class StationEditComponent implements OnChanges {
    @Input() station: EBGSStationV4Schema;
    @Input() set modalOpen(value: boolean) {
        this.stationEditModal = value;
    };
    @Output() modalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    stationEditModal: boolean;
    constructor(
        private serverService: ServerService
    ) {
    }

    save() {

    }

    reset() {

    }

    ngOnChanges(changes: SimpleChanges) {

    }

    stationModal(state: boolean) {
        this.stationEditModal = state;
        this.modalOpenChange.emit(this.stationEditModal);
    }
}
