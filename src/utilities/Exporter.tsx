import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { IWindowState, Window } from 'src/components/Board/BoardElements/Window';
import { SketchBoard } from 'src/components/Board/SketchBoard';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';

class Exporter {

    /*
    We extract the StyleDecleration of every given WindowSketch.
    Anschließend erstellen wir eine global StyleDecleration.
    Dann wird es Zeit die WindowSkeches in html strings umzuwandeln.
    Dafür geben wir ihnen die local- und globalStyleDecleration mit, damit sie wissen, welche id und Klassen ein Element hat.
    */
    public static download(windows: Array<Window<IWindowState>>) {
        if (windows.length === 0) {
            throw ReferenceError('sketches is not allowed to be empty');
        }
        const zip = new JSZip();
        const sketchBoard = SketchBoard.getInstance();
        const sketchBoardName = sketchBoard.getName();
        const sketchBoardFolder = zip.folder(sketchBoardName)
        const sketchStyleDeklarations: CssStyleDeclaration[] = [];
        for (const window of windows) {
            sketchStyleDeklarations.push(window.getStyleDecleration())
        }
        const globalStyleDecleration = CssStyleDeclaration.intersect(sketchStyleDeklarations);
        sketchBoardFolder.file(sketchBoard.getName() + "_StyleSheet.css", new Blob([globalStyleDecleration.toString()], { type: 'text/plain' }), { base64: true });
        for (let i = 0, len = windows.length; i < len; ++i) {
            const localStyleDecleration = sketchStyleDeklarations[i];
            const localFolder = sketchBoardFolder.folder(windows[i].getName());
            localFolder.file(windows[i].getName() + "_StyleSheet.css", new Blob([localStyleDecleration.toString()], { type: 'text/plain' }), { base64: true });
            localFolder.file(windows[i].getName() + ".html", new Blob([windows[i].toString(localStyleDecleration, globalStyleDecleration)], { type: 'text/plain' }), { base64: true });
        }
        zip.generateAsync({ type: "blob" })
            .then(content => saveAs(content, sketchBoard.getName() + ".zip"));
    }
}

export default Exporter;