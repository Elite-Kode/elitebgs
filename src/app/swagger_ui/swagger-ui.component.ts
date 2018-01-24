import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Spec, Path, Schema } from 'swagger-schema-official';

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

    constructor(private http: HttpClient) {
        this.sideNavActive = [];
        this.sideNavActive['Home'] = true;
    }

    ngOnInit(): void {
        this.currentVersion = this.docSpecs[this.docSpecs.length - 1];
        this.createDocumentation();
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

    getDefinitionFromRef(ref: string): string {
        return ref.replace('#/definitions/', '');
    }

    onVersionSelect(index: number) {
        this.currentVersion = this.docSpecs[index];
        this.createDocumentation();
    }
}
