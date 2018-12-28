// import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import WindowSketch from 'src/components/WindowSketch';

class Exporter {

    public static download(sketches: WindowSketch[]) {
        const zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");
        // extract cssStyleDeclarations for all sketches
        const sketchStyleDeklarations = [];
        for (const sketch of sketches) {
            sketchStyleDeklarations.push(sketch.extractStyleDeclaration())
        }
    }
}

export default Exporter;