import Element from 'src/components/Element';
import { IElementState } from '../interfaces';
import Class from './Class';
import CssRule from './CssRule';
import Id from './Id';

class CssStyleDeclaration {

    /*
    Erstellt eine neue CssStyleDecleration.
    Jedes paar (cssProperty, value), dass in allen der übergebenen Declerationen vorkommt
    wir ihr hinzugefügt und gleichzeitig aus allen üergebenen Declerationen gelöscht.
    Ein solches tupel kann in der einen dekleration als Id und in einer anderen als Klasse vorkommen.
    Fall 1 (Id):
        Wir entfernen das paar (cssProperty, value) aus der Id.
    Fall 2 (Klasse):
        Wir entfernen das paar (cssProperty, value) aus der Klasse.
        Für alle anderen subjects der Klasse außer subject fügen wir das paar wieder hinzu.
     */
    public static intersect(cssStyleDeclarations: CssStyleDeclaration[]): CssStyleDeclaration { // rework
        const intersection = new CssStyleDeclaration();
        for (const decleration of cssStyleDeclarations) {
            for (const subjectId of Object.keys(decleration.searchTree)) {
                for (const cssProperty of Object.keys(decleration.searchTree[subjectId])) {
                    const value = Object.keys(decleration.searchTree[subjectId][cssProperty])[0];
                    // now we have a pair (cssProperty, value)
                    // we need to check if this pair exists in all 
                    if (CssStyleDeclaration.propertyValuePairExistsInAll(cssStyleDeclarations, cssProperty, value)) {
                        // wir gehen jetzt jede einzelne dcleration durch um die cssRule mit dem paar zu finden
                        for (const localDecleration of cssStyleDeclarations) {
                            const localRule = localDecleration.findInSearchTree(cssProperty, value);
                            if (localRule instanceof Id) {
                                const localSubject = localRule.getSubject();
                                localDecleration.removePropertyValuePair(localSubject, cssProperty, value, localRule);
                                intersection.addRule(localSubject, cssProperty, value);
                            } else if (localRule instanceof Class) {
                                localRule.removePropertyValuePair(cssProperty, value);
                                if (localRule.getPropertyValuePairCount() === 0) {
                                    localDecleration.removeRule(localRule);
                                }
                                for (const localSubject of localRule.subjects) {
                                    localDecleration.removeFromSearchTree(localSubject, cssProperty, value);
                                    intersection.addRule(localSubject, cssProperty, value);
                                }
                            } else {
                                throw EvalError('Intersect shows unexpected behaviour.')
                            }
                        }
                    }
                }
            }
        }
        return intersection;
    }

    private static propertyValuePairExistsInAll(cssStyleDeclarations: CssStyleDeclaration[], cssProperty: string, value: string): boolean {
        for (let i=0, len=cssStyleDeclarations.length; i<len; ++i) {
            const decleration = cssStyleDeclarations[i];
            if (decleration.findInSearchTree(cssProperty, value) === null) {
                return false;
            }
        }
        return true;
    }

    private ids: Id[] = [];

    private classes: Class[] = [];

    /*
    subject-id
        |
        cssProperty
            |
            value
                |
                rule
    */
    private searchTree: object = {};

    private subjectDict: object = {};

    /*
    Wandelt die StyleDeclaration in den Text des zugehörigen CssStylesheets um.
    Oben stehen dabei Ids, gefolgt von Klassen in absteigender Reihenfolge.
    */
    public toString(): string {
        let result = '';
        for (const id of this.ids) {
            result += id.toString();
        }
        for (const localClass of this.classes) {
            result += localClass.toString();
        }
        return result;
    }

    /*
    Jedes 3-tupel (subject, cssProperty, value) aus der Eingabedeklaration wird
    der lokalen Deklaration hinzugefügt.
    */
    public unite(cssStyleDeclaration: CssStyleDeclaration) {
        for (const subjectId of Object.keys(cssStyleDeclaration.searchTree)) {
            for (const cssProperty of Object.keys(cssStyleDeclaration.searchTree[subjectId])) {
                const value = Object.keys(cssStyleDeclaration.searchTree[subjectId][cssProperty])[0];
                this.addRule(cssStyleDeclaration.subjectDict[subjectId], cssProperty, value);
            }
        }
    }

    /*
    1. Wenn das tupel aus (subject, cssProperty, value) schon existiert tu nichts.
       Wir bezeichnen das Element subject als a.
    2. Entweder gibt es jetzt das paar (cssProperty, value) schon oder nicht.
       Wir sprechen im Ersten Fall von 2.1 und im zweiten von 2.2.

       2.2.1 Das paar kommt jetzt entweder in einer Klasse oder einer Id vor, von denen in beiden Fällen
             subject kein Untertan ist.
        
            2.2.1.1 Entweder ist das Paar (cssProperty, value) das einzige unter beagter Klasse k oder es gibt noch andere.

                2.2.1.1.1 Wir fügen a als subject der Klasse hinzu.
                --------------------------------------------
                2.2.1.1.2 Wir entfernen das Paar (cssProperty, value) aus k.
                Jetzt gibt es entweder schon eine Klasse k2 von der subject und alle subjects von k subjects sind,
                wir nennen diese Menge combinedSubjects, oder nicht.

                    2.2.1.1.2.1 Wir fügen das Paar (cssProperty, value) k2 hinzu.
                    --------------------------------------------
                    2.2.1.1.2.2 Wir erstellen eine neue Klasse k2 mit höherer Priorität als k.
                    Sie übernimmt alle subjets von k und bekommt das Paar (cssProperty, value) zugewiesen.
            --------------------------------------------
            2.2.1.2.1 Wir entfernen das paar (cssProperty, value) aus der Id von Element b.
            2.2.1.2.2 Jetzt gibt es entweder eine Klasse k von der a und b subjects sind oder nicht.

                2.2.1.2.2.1 Entweder besteht die Menge der subjects von k nur aus a und b oder enthält noch andere Elemente.

                    2.2.1.2.2.1.1 Wir fügen das paar (cssProperty, value) der Klasse hinzu.
                    --------------------------------------------
                    2.2.1.2.2.1.2 Entweder gibt es schon einen Wert für cssProperty in k oder nicht.

                        2.2.1.2.2.1.2.1 wir erstellen eine neue Klasse k2 mit höhere priorität als k.
                        Ihre subjects sind nur a und b.
                        Wir ordnen ihr das paar (cssProperty, value) zu.
                        --------------------------------------------
                        2.2.1.2.2.1.2.2 Wir erstellen eine neue Klasse k2 mit höhere priorität (ist das nötig?) als k.
                        Ihre subjects sind nur a und b.
                        Wir ordnen ihr das paar (cssProperty, value) zu.
                --------------------------------------------
                2.2.1.2.2.2.1 Wir erstellen eine neue Klasse mit subjects a und b und dem paar (cssProperty, value).
        --------------------------------------------
       2.2.1 Das paar kommt zu den regeln unter dem id selektor für a. 
    */
    public addRule(subject: Element<IElementState>, cssProperty: string, value: string) {
        if (this.existsInSearchTree(subject, cssProperty, value) === true) {
            return;
        }
        const ruleWithPair = this.findInSearchTree(cssProperty, value);
        if (ruleWithPair === null) {
            this.addToSubjectsId(subject, cssProperty, value);
        } else {
            if (ruleWithPair instanceof Id) {
                const subjectB = ruleWithPair.getSubject();
                this.removePropertyValuePair(subjectB, cssProperty, value, ruleWithPair);
                const combinedSubjects = [subject, subjectB];
                const commonClassIndex = this.findIndexInClassesTopset(combinedSubjects);
                if (commonClassIndex === -1) {
                    this.addNewClass(combinedSubjects, cssProperty, value);
                } else {
                    const commonClass = this.classes[commonClassIndex];
                    if (commonClass.subjects.length === 2) {
                        this.addPropertyValuePair(subject, cssProperty, value, commonClass);
                        this.addPropertyValuePair(subjectB, cssProperty, value, commonClass);
                    } else {
                        this.addNewClass(combinedSubjects, cssProperty, value, true);
                    }
                }
            } else if (ruleWithPair instanceof Class) {
                if (ruleWithPair.subjects.length === 1) {
                    ruleWithPair.addSubject(subject);
                    this.addToSearchTree(subject, cssProperty, value, ruleWithPair);
                } else {
                    this.removePropertyValuePair(subject, cssProperty, value, ruleWithPair);
                    const combinedSubjects = [subject].concat(ruleWithPair.subjects);
                    const commonClassIndex = this.findIndexInClassesSubset(combinedSubjects);
                    if (commonClassIndex === -1) {
                        this.addNewClass(combinedSubjects, cssProperty, value, true);
                    } else {
                        const commonClass = this.classes[commonClassIndex];
                        commonClass.addPropertyValuePair(cssProperty, value);
                        for (const localSubject of combinedSubjects) {
                            this.addToSearchTree(localSubject, cssProperty, value, commonClass);
                        }
                    }
                }
            }
        }
    }

    public getSubjectsId(subject: Element<IElementState>): Id | null {
        for (const id of this.ids) {
            if (id.getSubject() === subject) {
                return id;
            }
        }
        return null;
    }

    public getSubjectsClasses(subject: Element<IElementState>): Class[] {
        const result = [];
        for (const localClass of this.classes) {
            if (localClass.subjects.includes(subject) === true) {
                result.push(localClass);
            }
        }
        return result;
    }

    private removeRule(rule: Id | Class) {
        if (rule instanceof Id) {
            const index = this.ids.indexOf(rule);
            if (index > -1) {
                this.ids.splice(index, 1);
            } else {
                throw EvalError('the given Id does not exist in the Ids of this Decleration.');
            }
        } else {
            const index = this.classes.indexOf(rule);
            if (index > -1) {
                this.classes.splice(index, 1);
            } else {
                throw EvalError('the given class does not exist in the Classes of this Decleration.');
            }
        }
    }

    private addPropertyValuePair(subject: Element<IElementState>, cssProperty: string, value: string, rule: CssRule) {
        rule.addPropertyValuePair(cssProperty, value);
        this.addToSearchTree(subject, cssProperty, value, rule);
    }

    private removePropertyValuePair(subject: Element<IElementState>, cssProperty: string, value: string, rule: Id | Class) {
        rule.removePropertyValuePair(cssProperty, value);
        if (rule.getPropertyValuePairCount() === 0) {
            this.removeRule(rule);
        }
        if (rule instanceof Id) {
            this.removeFromSearchTree(subject, cssProperty, value);
        } else {
            for (const localSubject of rule.subjects) {
                this.removeFromSearchTree(localSubject, cssProperty, value);
            }
        }
    }

    private addNewClass(subjects: Array<Element<IElementState>>, cssProperty: string, value: string, hasPriority: boolean = false) {
        const newCommonClass = new Class(subjects);
        newCommonClass.addPropertyValuePair(cssProperty, value);
        if (hasPriority === true) {
            this.classes.unshift(newCommonClass);
        } else {
            this.classes.push(newCommonClass);
        }
        for (const subject of subjects) {
            this.addToSearchTree(subject, cssProperty, value, newCommonClass);
        }
    }

    private addToSubjectsId(subject: Element<IElementState>, cssProperty: string, value: string) {
        let subjectsId = this.getSubjectsId(subject);
        if (subjectsId === null) {
            subjectsId = new Id(subject);
            this.ids.push(subjectsId);
        }
        this.addPropertyValuePair(subject, cssProperty, value, subjectsId);
    }

    private addToSearchTree(subject: Element<IElementState>, cssProperty: string, value: string, rule: CssRule) {
        if (this.searchTree[subject.id] === undefined) {
            this.searchTree[subject.id] = {};
            this.subjectDict[subject.id] = subject;
        }
        if (this.searchTree[subject.id][cssProperty] === undefined) {
            this.searchTree[subject.id][cssProperty] = {};
        }
        this.searchTree[subject.id][cssProperty][value] = rule;
    }

    private removeFromSearchTree(subject: Element<IElementState>, cssProperty: string, value: string) {
        if (this.searchTree[subject.id] === undefined) {
            return;
        }
        if (this.searchTree[subject.id][cssProperty] === undefined) {
            return;
        }
        if (this.searchTree[subject.id][cssProperty][value] === undefined) {
            return;
        }
        delete this.searchTree[subject.id][cssProperty][value];
    }

    private existsInSearchTree(subject: Element<IElementState>, cssProperty: string, value: string) {
        if (this.searchTree[subject.id] === undefined) {
            return false;
        }
        if (this.searchTree[subject.id][cssProperty] === undefined) {
            return false;
        }
        if (this.searchTree[subject.id][cssProperty][value] === undefined) {
            return false;
        }
        return true;
    }

    private findInSearchTree(cssProperty: string, value: string): null | CssRule {
        for (const subjectId of Object.keys(this.searchTree)) {
            if (this.searchTree[subjectId][cssProperty] === undefined) {
                continue;
            }
            if (this.searchTree[subjectId][cssProperty][value] === undefined) {
                continue;
            }
            return this.searchTree[subjectId][cssProperty][value];
        }
        return null;
    }

    private findIndexInClassesTopset(subjects: Array<Element<IElementState>>): number {
        for (let i = this.classes.length - 1; i > -1; --i) {
            const localClass = this.classes[i];
            if (localClass.subjects.every(subject => subjects.includes(subject)) === true) {
                return i;
            }
        }
        return -1;
    }

    private findIndexInClassesSubset(subjects: Array<Element<IElementState>>): number {
        for (let i = this.classes.length - 1; i > -1; --i) {
            const localClass = this.classes[i];
            if (subjects.every(subject => localClass.subjects.includes(subject)) === true) {
                return i;
            }
        }
        return -1;
    }
}

export default CssStyleDeclaration;