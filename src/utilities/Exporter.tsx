// import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import WindowSketch from 'src/components/WindowSketch';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';

class Exporter {

    public static download(sketches: WindowSketch[]) {
        const zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");
        // extract cssStyleDeclarations for all sketches
        const sketchStyleDeklarations: CssStyleDeclaration[] = [];
        for (const sketch of sketches) {
            sketchStyleDeklarations.push(sketch.extractStyleDeclaration())
        }
        const globalStyleDecleration = CssStyleDeclaration.intersect(sketchStyleDeklarations);
        console.log(globalStyleDecleration);
        console.log(sketchStyleDeklarations);
    }
}

export default Exporter;