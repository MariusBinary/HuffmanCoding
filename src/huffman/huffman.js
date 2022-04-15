
/********************************* */
/* CODIFICA DI HUFFMAN             */
/********************************* */

class HuffmanAlgorithm {
    constructor(input) {
        this.input = [{ step: 0, symbols: [...input] }];
        this.nodes = [];
        this.codes = [];
    }

    reduce() {
        // Ordina i simboli in ordine crescente in base alla probabilità.      
        this.input[0].symbols.sort(function (a, b) {
            return a.probability - b.probability;
        });

        // Aggiungo i simboli di base per la rappresentazione ad albero.
        this.nodes.push({symbols: [...this.input[0].symbols]});

        // Imposta la priorità di ogni simbolo dopo il sorteggio.
        for (let i = 0; i < this.input[0].symbols.length; i++) {
            this.input[0].symbols[i].order = i;
        }

        // Effetua la codifica di huffman un passo alla volta.
        let hasSymbolsToReduce = true;
        while (hasSymbolsToReduce) {
            const array = this.input[this.input.length - 1];
            const symbols = this.reduceNext(array.symbols);
            this.input.push({
                step: array.step + 1,
                symbols: symbols
            });

            // Se ci sono meno di due simboli, terminare il ciclo.
            if (symbols.length <= 1) {
                hasSymbolsToReduce = false;
            }
        }

        return this.input;
    }

    // Cerca la coppia con le probabilità minori e la raggruppa.
    reduceNext(array) {
        const x = this.findMin(array, -1);
        const y = this.findMin(array, x);
        const order = array[x].order > array[y].order;

        // Creo una nuova coppia di simboli.
        const symbol = {
            left: order ? array[y] : array[x],
            right: order ? array[x] : array[y],
            probability: (array[x].probability + array[y].probability),
            order: order ? array[y].order : array[x].order
        }

        // Creo un nodo per la rappresentazione ad albero.
        const node = {
            x1: order ? array[y].order : array[x].order,
            x2: order ? array[x].order : array[y].order,
            probability: symbol.probability
        };
        this.nodes.push(node);

        const reducedSymbols = [...array];
        reducedSymbols[x] = symbol;
        reducedSymbols.splice(y, 1);
        return reducedSymbols;
    }

    // Cerca il simbolo con la probabilità minore.
    findMin(array, skip) {
        let min = skip === 0 ? 1 : 0;
        for (let i = 0; i < array.length; i++) {
            if (i === skip) continue;
            if (array[i].probability < array[min].probability) {
                min = i;
            }
        }
        return min;
    }

    // Calcola il codice di huffman per ogni simbolo.
    calculateCodes(data, code, direction, root = false) {

        // Se siamo arrivati al simbolo, impostare la codifica generata.
        if (data.character !== undefined) {
            data.code = code;
            this.codes.push({
                character: data.character,
                probability: data.probability,
                code
            });
            return;
        }

        // Se non siamo arrivati al simbolo, seguire il percorso dei 
        // rami aggiungendo 0 o 1 in base alla direzione fornita.
        this.calculateCodes(data.left, code + (direction ? "1" : "0"), direction);
        this.calculateCodes(data.right, code + (direction ? "0" : "1"), direction);

        if (root) return this.codes;
    }

    getNodes() {
        return this.nodes;
    }
}

export default HuffmanAlgorithm;