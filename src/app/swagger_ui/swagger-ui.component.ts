import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Spec, Path, Schema, Parameter } from 'swagger-schema-official';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TryAPIService } from '../services/tryapi.service';

export interface IInputSpec {
    versionName: string;
    specLocation: string;
}

@Component({
    selector: 'app-swagger-ui',
    templateUrl: './swagger-ui.component.html',
    styleUrls: ['./swagger-ui.component.scss']
})
export class SwaggerUIComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    @Input() docSpecs: IInputSpec[];
    doc: Spec;
    currentVersion: IInputSpec;
    paths: [string, Path][];
    definitions: [string, Schema][];
    sideNavActive: {};
    tryAPIModal: boolean;
    tryAPIMethod: string;
    tryPath: string;
    tryAPIResponse: string;
    tryAPIURL: string;
    parametersForm: FormGroup;
    parametersInSelect: Parameter[];
    parametersSelected: [Parameter, string][];

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private tryAPIService: TryAPIService
    ) {
        this.sideNavActive = [];
        this.sideNavActive['Home'] = true;
        this.createForm();
    }

    ngOnInit(): void {
        this.currentVersion = this.docSpecs[this.docSpecs.length - 1];
        this.createDocumentation();
    }

    createForm() {
        this.parametersForm = this.formBuilder.group({
            parameterChoice: [],
            parameters: this.formBuilder.array([])
        });
    }

    createFormParameters(parameters: [Parameter, string][]) {
        const formGroup: FormGroup[] = [];
        parameters.forEach(parameter => {
            formGroup.push(this.formBuilder.group({
                value: parameter[1]
            }));
        });

        this.parametersForm.setControl('parameters', this.formBuilder.array(formGroup));

        (this.parametersForm.get('parameters') as FormArray).controls.forEach((control, index) => {
            control.get('value').valueChanges
                .subscribe(value => {
                    this.parametersSelected[index][1] = value;
                    this.updateURL();
                });
        });
    }

    private createDocumentation() {
        this.http.get<Spec>(this.currentVersion.specLocation).subscribe(doc => {
            this.doc = doc;
            this.paths = Object.entries(this.doc.paths);
            this.definitions = Object.entries(this.doc.definitions);
            for (let i = 0; i < this.paths.length; i++) {
                this.sideNavActive[this.paths[i][0]] = false;
            }
            for (let i = 0; i < this.definitions.length; i++) {
                this.sideNavActive[this.definitions[i][0]] = false;
            }
        });
    }

    makeActive(name: string): void {
        Object.entries(this.sideNavActive).forEach(entry => {
            if (entry[0] === name) {
                this.sideNavActive[name] = true;
            } else {
                this.sideNavActive[entry[0]] = false;
            }
        })
    }

    getMethods(path: string): string[] {
        return Object.keys(this.doc.paths[path]);
    }

    getProperties(definition: string): string[] {
        return Object.keys(this.doc.definitions[definition].properties);
    }

    getResponses(path: string, method: string): string[] {
        return Object.keys(this.doc.paths[path][method].responses)
    }

    getParameters(path: string, method: string): Parameter[] {
        switch (method) {
            case 'get':
                return [...this.doc.paths[path].get.parameters];
            case 'post':
                return [...this.doc.paths[path].post.parameters];
            case 'patch':
                return [...this.doc.paths[path].patch.parameters];
            case 'put':
                return [...this.doc.paths[path].put.parameters];
            case 'delete':
                return [...this.doc.paths[path].delete.parameters];
            default:
                return null;
        }
    }

    getDefinitionFromRef(ref: string): string {
        return ref.replace('#/definitions/', '');
    }

    onVersionSelect(index: number) {
        this.currentVersion = this.docSpecs[index];
        this.createDocumentation();
    }

    createParametersInSelect(method: string, path: string) {
        this.parametersInSelect = this.getParameters(path, method);
        this.parametersSelected = [];
    }

    addSelectedParameters() {
        (this.parametersForm.get('parameterChoice').value as string[]).forEach(choice => {
            const indexOfChoice = this.parametersInSelect.findIndex(element => {
                return element.name === choice;
            });
            if (indexOfChoice !== -1) {
                this.parametersSelected.push([this.parametersInSelect[indexOfChoice], '']);
                this.parametersInSelect.splice(indexOfChoice, 1);
            }
        });
        this.createFormParameters(this.parametersSelected);
        this.updateURL();
    }

    updateURL() {
        this.tryAPIURL = this.doc.schemes + '://' + this.doc.host + this.doc.basePath + this.tryPath;
        if (this.parametersSelected.length > 0) {
            this.tryAPIURL += '?';
            for (let index = 0; index < this.parametersSelected.length; index++) {
                if (index > 0) {
                    this.tryAPIURL += '&';
                }
                this.tryAPIURL += this.parametersSelected[index][0].name + '=' + this.parametersSelected[index][1]
            }
        }
    }

    deselectParameter(parameter: Parameter) {
        this.parametersInSelect.push(parameter);
        const indexOfRemoval = this.parametersSelected.findIndex(element => {
            return element[0].name === parameter.name;
        });
        this.parametersSelected.splice(indexOfRemoval, 1);
        this.createFormParameters(this.parametersSelected);
        this.updateURL();
    }

    tryAPI(method: string, path: string) {
        this.createParametersInSelect(method, path);
        this.createFormParameters(this.parametersSelected);
        this.tryAPIURL = this.doc.schemes + '://' + this.doc.host + this.doc.basePath + path;
        this.tryAPIModal = true;
        this.tryAPIMethod = method;
        this.tryPath = path;
        this.tryAPIResponse = '';
    }

    go() {
        this.tryAPIService.getAPIResponse(this.tryAPIURL)
            .subscribe(response => {
                this.tryAPIResponse = JSON.stringify(response, null, 4);
            });
    }

    reset() {
        this.createParametersInSelect(this.tryAPIMethod, this.tryPath);
        this.createFormParameters(this.parametersSelected);
        this.tryAPIURL = this.doc.schemes + '://' + this.doc.host + this.doc.basePath + this.tryPath;
        this.tryAPIResponse = '';
    }
}
