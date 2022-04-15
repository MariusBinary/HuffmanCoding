
// Arrotonda un numero.
export const roundOff = (num, places) => {
    const x = Math.pow(10, places);
    return Math.round(num * x) / x;
}

// Riempie un array.
export const fillArray = (length, fill) => {
    const array = [];
    for (let i = 0; i < length; i++) {
        array.push(fill);
    }
    return array;
}

// Converte i bit in un'unità di misura più leggibile.
export const bytesToSize = (bits) => {
    if (bits < 8) return bits + ' bits';
    const bytes = bits / 8;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }