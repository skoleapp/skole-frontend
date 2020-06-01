// Converts a data URI string into a File object.
export const dataURItoFile = (dataURI: string): File => {
    const BASE64_MARKER = ';base64,';
    const mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
    const filename = 'dataURI-file-' + new Date().getTime() + '.' + mime.split('/')[1];
    const bytes = atob(dataURI.split(BASE64_MARKER)[1]);
    const writer = new Uint8Array(new ArrayBuffer(bytes.length));

    for (let i = 0; i < bytes.length; i++) {
        writer[i] = bytes.charCodeAt(i);
    }

    return new File([writer.buffer], filename, { type: mime });
};
