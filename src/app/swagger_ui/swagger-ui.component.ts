import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Spec, Path, Schema } from 'swagger-schema-official';

@Component({
    selector: 'app-swagger-ui',
    templateUrl: './swagger-ui.component.html',
    styleUrls: ['./swagger-ui.component.scss']
})

export class SwaggerUIComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    @Input() docUrl: string;
    doc: Spec;
    paths: [string, Path][];
    definitions: [string, Schema][];
    sideNavActive: {};

    constructor(private http: HttpClient) {
        this.sideNavActive = [];
        this.sideNavActive['Home'] = true;
    }

    ngOnInit(): void {
        this.http.get<Spec>(this.docUrl).subscribe(doc => {
            this.doc = doc;
            this.paths = Object.entries(this.doc.paths);
            this.definitions = Object.entries(this.doc.definitions);
            for (let i = 0; i < this.paths.length; i++) {
                this.sideNavActive[this.paths[i][0]] = false;
            }
            for (let i = 0; i < this.definitions.length; i++) {
                this.sideNavActive[this.definitions[i][0]] = false;
            }
        })
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

    getResponseSchema(schema: Schema): string {
        if (schema.$ref) {
            return schema.$ref.replace('#/definitions/', '');
        } else if (schema.type && schema.type === 'array') {
            return `[${(<Schema>schema.items).$ref.replace('#/definitions/', '')}]`;
        } else {
            return '';
        }
    }
}
