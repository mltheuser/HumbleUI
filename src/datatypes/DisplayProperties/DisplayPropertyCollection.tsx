import CssStyleDeclaration from '../CssDataTypes/CssStyleDeclaration';
import DisplayProperty from "./DisplayProperty";
import BackgroundColor from './Properties/BackgroundColor';
import BorderColor from './Properties/Border/BorderColor';
import BorderStyle from './Properties/Border/BorderStyle';
import BorderWidth from './Properties/Border/BorderWidth';
import BorderBottomLeftRadius from './Properties/BorderRadius/BorderBottomLeftRadius';
import BorderBottomRightRadius from './Properties/BorderRadius/BorderBottomRightRadius';
import BorderTopLeftRadius from './Properties/BorderRadius/BorderTopLeftRadius';
import BorderTopRightRadius from './Properties/BorderRadius/BorderTopRightRadius';
import Height from './Properties/Height';
import Left from './Properties/Left';
import Top from './Properties/Top';
import Width from './Properties/Width';

class DisplayPropertyCollection {

    public left: Left;
    
    public top: Top;

    public height: Height;

    public width: Width;

    public "background-color": BackgroundColor;

    public "border-top-right-radius": BorderTopRightRadius;

    public "border-top-left-radius": BorderTopLeftRadius;

    public "border-bottom-right-radius": BorderBottomRightRadius;

    public "border-bottom-left-radius": BorderBottomLeftRadius;

    public "border-color": BorderColor;

    public "border-style": BorderStyle;

    public "border-width": BorderWidth;

    public add(property: DisplayProperty) {
        this[property.getProperty()] = property;
    }

    public addToStyleDecleration(cssStyleDeclaration: CssStyleDeclaration) {
        for (const propertyKey of Object.keys(this)) {
            this[propertyKey].addRule(cssStyleDeclaration);
        }
    }

    public borderIsChecked() {
        return this["border-style"] instanceof BorderStyle && this["border-style"].getValue() !== "none";
    }

    public clone(): DisplayPropertyCollection {
        const clone = new DisplayPropertyCollection();
        for (const property in this) {
            if (this.hasOwnProperty(property)) {
                if (this[property] instanceof DisplayProperty === false) {
                    console.log(property);
                    continue;
                }
                const displayProperty = this[property] as unknown as DisplayProperty;
                clone.add(displayProperty.clone());
            }
        }
        return clone;
    }

}

export default DisplayPropertyCollection;