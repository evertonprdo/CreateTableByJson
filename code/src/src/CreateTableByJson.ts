import { Helpers } from "../tools/Helpers.js";
import { DataObject } from "./DataObject.js";
import { OptionType, DataObjectType } from "../tools/types.js";

export class CreateTableByJson {
    table: HTMLTableElement;
    data: DataObject;
    headers: OptionType;
    html_options: OptionType;
    
    constructor(data: DataObject | DataObjectType, headers: OptionType, table?: HTMLTableElement) {
        this.data = data instanceof DataObject ? data : new DataObject(data);
        this.headers = headers;
        this.html_options = {} as OptionType;
        this.table = table ? table : this.createTable();
    }

    HtmlOptionSet(opt: OptionType): void {
        if(opt) {
            for (const key in opt) {
                this.html_options[key] = opt[key];
            }
        } else {
            throw new Error;
        }
    }

    HtmlOptionDelete(opt: string[]): void {
        if (opt.length > 0) {
            opt.forEach(key => {
                delete this.html_options[key]
            })
        }
    }

    setHtmlAtribute(html: HTMLElement, opts: OptionType): void {
        for (const key in opts) {
            html.setAttribute(key, opts[key] as string)
        }
    }

    createCell(type: "th" | "td", inner_text: string, option?: (cell: HTMLTableCellElement) => void): HTMLTableCellElement {
        const cell = document.createElement(type);
        if (option) {
            option(cell);
        }
        cell.innerText = inner_text;
        return cell;
    }

    createRow(str: "th" | "td", item: OptionType, thead:boolean = false): HTMLTableRowElement {
        const tr = document.createElement('tr');
        for (const key in this.headers) {
            if (thead) {
                const cell = this.createCell(str, `${this.headers[key]}`);
                tr.appendChild(cell);
            } else {
                const cell = this.createCell(str, `${Helpers.getNestedProperty(item, key)}`);
                tr.appendChild(cell);
            }
        }
        return tr;
    }

    createThead(): HTMLTableSectionElement {
        const thead = document.createElement('thead');
        thead.appendChild(this.createRow('th', this.headers, true));
        return thead;
    }

    createTbody(): HTMLTableSectionElement {
        const tbody = document.createElement('tbody');
        for (let i = 0; i < this.data.records.length; i++) {
            tbody.appendChild(this.createRow('td', this.data.records[i]))
        }
        return tbody;
    }

    createTfoot(): HTMLTableSectionElement {
        const tfoot = document.createElement('tfoot');
        tfoot.appendChild(this.createRow('td', this.headers, true));
        return tfoot;
    }

    createTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.appendChild(this.createThead());
        table.appendChild(this.createTbody());
        table.appendChild(this.createTfoot());
        return table;
    }
}