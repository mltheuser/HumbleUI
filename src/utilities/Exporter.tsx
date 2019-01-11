import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import WindowSketch from 'src/components/Board/Elements/WindowSketch';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';

class Exporter {

    /*
    We extract the StyleDecleration of every given WindowSketch.
    Anschließend erstellen wir eine global StyleDecleration.
    Dann wird es Zeit die WindowSkeches in html strings umzuwandeln.
    Dafür geben wir ihnen die local- und globalStyleDecleration mit, damit sie wissen, welche id und Klassen ein Element hat.
    */
    public static download(sketches: WindowSketch[]) {
        if (sketches.length === 0) {
            throw ReferenceError('sketches is not allowed to be empty');
        }
        const zip = new JSZip();
        const sketchBoard = sketches[0].sketchBoard;
        const sketchBoardName = sketchBoard.name;
        const sketchBoardFolder = zip.folder(sketchBoardName)
        const sketchStyleDeklarations: CssStyleDeclaration[] = [];
        for (const sketch of sketches) {
            sketchStyleDeklarations.push(sketch.getStyleDecleration())
        }
        const globalStyleDecleration = CssStyleDeclaration.intersect(sketchStyleDeklarations);
        sketchBoardFolder.file(sketchBoard.name + "_StyleSheet.css", new Blob([globalStyleDecleration.toString()], { type: 'text/plain' }), { base64: true });
        for (let i = 0, len = sketches.length; i < len; ++i) {
            const localStyleDecleration = sketchStyleDeklarations[i];
            const localFolder = sketchBoardFolder.folder(sketches[i].name);
            localFolder.file(sketches[i].name + "_StyleSheet.css", new Blob([localStyleDecleration.toString()], { type: 'text/plain' }), { base64: true });
            localFolder.file(sketches[i].name + ".html", new Blob([sketches[i].toString(localStyleDecleration, globalStyleDecleration)], { type: 'text/plain' }), { base64: true });
        }
        zip.generateAsync({ type: "blob" })
            .then(content => saveAs(content, sketchBoard.name + ".zip"));
    }
}

export default Exporter;