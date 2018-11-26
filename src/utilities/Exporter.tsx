class Exporter {
    public static saveFile() {
        const text = "hello world";
        const blob = new Blob([text], { type: 'text/plain' });
        const anchor = document.createElement('a');

        anchor.download = "hello.txt";
        anchor.href = window.URL.createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
    }
}

export default Exporter;