// import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import Sketch from 'src/components/Sketch';
import CssRule from 'src/datatypes/CssRule';
import WindowSketch from 'src/components/WindowSketch';

class Exporter {

    public static convertSketch(sketch: Sketch) {
        const domElementsLength = sketch.state.sketches.data.length;
        const domElements = new Array(domElementsLength);
        for (let i = 0; i < domElementsLength; ++i) {
            domElements[i] = sketch.state.sketches.data[i].convert();
        }
        const domElementsFlattend = this.fanOutElements(domElements);
        const cssRules = this.extractCssRules(domElementsFlattend);
        this.assignSelectors(domElementsFlattend, cssRules);
        return { domElements, cssRules };
    }

    public static download(sketches: WindowSketch[]) {
        const zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");

        // extract cssStyleDeclarations for all sketches
        const sketchStyleDeklarations = [];
        for (const sketch of sketches) {
            sketchStyleDeklarations.push(sketch.extractStyleDeclaration())
        }

        // create global css stylesheet

        // 
        /*
        for (i = 0; i < len; ++i) {
            const localFolder = zip.folder(sketches[i].name);
            localFolder.file(sketches[i].name + "_StyleSheet.css", new Blob([this.cssRulesToCss(convertedSketches[i].cssRules)], { type: 'text/plain' }), { base64: true });
            localFolder.file(sketches[i].name + ".html", new Blob([this.domElementsToHtml(convertedSketches[i].domElements, sketches[i].name)], { type: 'text/plain' }), { base64: true });
        }
        zip.generateAsync({ type: "blob" })
            .then(content => saveAs(content, "archive.zip"));
            */
    }

    private static cssList = document.createElement("div").style;

    private static assignSelectors(domElements: Element[], cssRules: CssRule[]) {
        for (let i = 0, len = cssRules.length; i < len; ++i) {
            const rule = cssRules[i];
            if (rule.subjects.length > 1) {
                rule.subjects.forEach(position => domElements[position].classList.add(rule.getName()))
            } else {
                domElements[rule.subjects[0]].id = rule.getName();
            }
        }
    }

    private static renderSelectors(element: Element) {
        let result = '';
        if (element.id !== "") {
            result += `id="${element.id}" `;
        }
        if (element.classList.length > 0) {
            result += 'class="'
            for (let i = 0, len = element.classList.length; i < len;) {
                const elementClass = element.classList[i];
                result += elementClass;
                if (++i < len) {
                    result += " ";
                }
            }
            result += '" ';
        }
        return result;
    }

    private static elementToHtml(element: Element | null, level: number = 1): string {
        if (element === null) {
            throw EvalError(`
            The Exporter tried to convert the null referenze to html. 
            This is not intended behaviour.
            `);
        }
        let positioningSequenze = "";
        for (let i = 0; i < level; ++i) {
            positioningSequenze += "\t";
        }
        const localName = element.localName;
        if (element.children.length === 0) {
            return `${positioningSequenze}<${localName} ${this.renderSelectors(element)}/>\n`;
        } else {
            let result = `${positioningSequenze}<${localName} ${this.renderSelectors(element)}>\n`;
            for (let i = 0, len = element.children.length; i < len; ++i) {
                result += this.elementToHtml(element.children.item(i), level + 1);
            }
            result += `${positioningSequenze}<${localName}/>\n`;
            return result;
        }
    }

    private static renderDomElements(domElements: HTMLElement[]) {
        let result = ``;
        for (let i = 0, len = domElements.length; i < len; ++i) {
            result += this.elementToHtml(domElements[i]);
        }
        return result;
    }

    private static domElementsToHtml(domElements: HTMLElement[], grandparentName: string): string {
        return '<!DOCTYPE HTML>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n<link rel="stylesheet" type="text/css" href="' + grandparentName + '_StyleSheet.css">\n</head>\n<body>\n' + this.renderDomElements(domElements) + "</body>\n</html>";
    }

    private static cssRulesToCss(cssRules: CssRule[]): string {
        let result = ``;
        for (let i = 0, len = cssRules.length; i < len; ++i) {
            const rule = cssRules[i];
            result += rule.getSelector() + " {\n";
            for (const key of Object.keys(rule.rules)) {
                result += "\t" + key + ": " + rule.rules[key] + ";\n"
            }
            result += "}\n\n";
        }
        return result;
    }

    private static extractChildren(parent: Element, arr: Element[]) {
        const children = parent.children;
        for (let i = 0, len = children.length; i < len; ++i) {
            const child = children.item(i);
            if (child !== null) {
                arr.push(child);
                this.extractChildren(child, arr);
            }
        }
    }

    private static fanOutElements(domElements: Element[]): Element[] {
        const flattendDomElements = [];
        for (let i = 0, len = domElements.length; i < len; ++i) {
            flattendDomElements.push(domElements[i]);
            this.extractChildren(domElements[i], flattendDomElements);
        }
        return flattendDomElements;
    }

    private static assignToCssList(arrPosition: number, element: HTMLElement, key: string, list: object) {
        if (list[key] === undefined) {
            list[key] = {};
        }
        for (const key2 of Object.keys(list[key])) {
            if (key2 === element.style[key]) {
                list[key][key2].push(arrPosition);
                return;
            }
        }
        list[key][element.style[key]] = [arrPosition];
    }

    private static assignCssPropertiesAndDeleteSubjects(selfSufficendRule: CssRule, parentRule: CssRule) {
        for (const cssProperty of Object.keys(parentRule.rules)) {
            if (selfSufficendRule.rules.hasOwnProperty(cssProperty)) {
                throw EvalError(`
                An Error has occured during the assignment of a cssProperty. 
                The target rule already has this property and overwriting it could cause a wrong result.
                `);
            }
            selfSufficendRule.rules[cssProperty] = parentRule.rules[cssProperty];
        }
        selfSufficendRule.subjects.forEach(subject => parentRule.subjects.splice(parentRule.subjects.indexOf(subject), 1));
    }

    private static groupProperties(cssPropertyList: object): CssRule[] {
        const rules: CssRule[] = [];
        for (const key of Object.keys(cssPropertyList)) {
            for (const key2 of Object.keys(cssPropertyList[key])) {
                const localRule = {};
                localRule[key] = key2;
                rules.push(new CssRule(cssPropertyList[key][key2], localRule));
            }
        }
        return rules;
    }

    private static cleanRules(rules: CssRule[]) {
        for (let i = 0; i < rules.length; ++i) {
            if (rules[i].subjects.length === 0) {
                rules.splice(i, 1);
                --i;
            }
        }
    }

    private static optimizeRules(rules: CssRule[]) {
        const len = rules.length;
        let z = 0;
        for (let i = 0; i < len; ++i) {
            const rule = rules[i];
            const subjectCount = rule.subjects.length;
            if (subjectCount === 0) {
                continue;
            }
            for (z = 0; z < len; ++z) {
                if (i === z) {
                    continue;
                }
                if (subjectCount === 1) {
                    if (rules[z].subjects.length === 1 && rule.subjects[0] === rules[z].subjects[0]) {
                        this.assignCssPropertiesAndDeleteSubjects(rule, rules[z]);
                    }
                } else {
                    if (rule.subjects.every(subject => rules[z].subjects.includes(subject))) {
                        this.assignCssPropertiesAndDeleteSubjects(rule, rules[z]);
                    }
                }
            }
        }
        this.cleanRules(rules);
    }

    private static convertToCssRules(cssPropertyList: object) {
        const rules = this.groupProperties(cssPropertyList);
        this.optimizeRules(rules);
        return rules;
    }

    private static createPropertyList(domElements: Element[]) {
        let i = 0;
        const len = domElements.length;
        const cssPropertyList = {};
        for (const key of Object.keys(this.cssList)) {
            for (i = 0; i < len; ++i) {
                const element: any = domElements[i];
                if (element.style[key] !== "") {
                    this.assignToCssList(i, element, key, cssPropertyList);
                    element.style[key] = "";
                }
            }
        }
        return cssPropertyList;
    }

    private static extractCssRules(domElements: Element[]) {
        const cssPropertyList = this.createPropertyList(domElements);
        return this.convertToCssRules(cssPropertyList);
    }
}

export default Exporter;