import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSSystemChart, EBGSSystemFactionChart } from '../../typings';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { FDevIDs } from '../../utilities/fdevids';

@Component({
    selector: 'app-system-edit',
    templateUrl: './system-edit.component.html',
    styleUrls: ['./system-edit.component.scss']
})
export class SystemEditComponent implements OnChanges {
    @Input() system: EBGSSystemChart;
    @Input() set modalOpen(value: boolean) {
        this.systemEditModal = value;
    };
    @Output() modalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    systemUnderEdit: EBGSSystemChart;
    systemEditModal: boolean;
    factionStates: string[] = [];
    systemForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder
    ) {
        Object.keys(FDevIDs.state).forEach(state => {
            if (this.factionStates.indexOf(FDevIDs.state[state].name) === -1) {
                this.factionStates.push(FDevIDs.state[state].name);
            }
        });
        this.createForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'system' && changes[propName].currentValue) {
                this.systemUnderEdit = _.cloneDeep(this.system);
                this.setFactions(this.systemUnderEdit);
            }
        }
    }

    get factions(): FormArray {
        return this.systemForm.get('factions') as FormArray;
    }

    createForm() {
        this.systemForm = this.formBuilder.group({
            factions: this.formBuilder.array([])
        });
    }

    systemModal(state: boolean) {
        this.systemEditModal = state;
        this.modalOpenChange.emit(this.systemEditModal);
    }

    setFactions(system: EBGSSystemChart) {
        const formGroup: FormGroup[] = [];
        system.factions.forEach(faction => {
            formGroup.push(this.formBuilder.group({
                influence: Math.round(faction.influence * 1000000) / 10000,
                state: FDevIDs.state[faction.state].name,
                is_controlling: this.isControlling(faction),
                pending_state: 'None',
                pending_state_trend: 'Trending Up',
                recovering_state: 'None',
                recovering_state_trend: 'Trending Up'
            }));
        });

        this.systemForm.setControl('factions', this.formBuilder.array(formGroup));
    }

    isControlling(faction: EBGSSystemFactionChart) {
        if (this.systemUnderEdit.controlling_minor_faction === faction.name_lower) {
            return true;
        } else {
            return false;
        }
    }
}
