
import { Component } from 'react';
import './HuffmanInput.css';
import HuffmanAlgorithm from '../../huffman/huffman';

class HuffmanInput extends Component {

    constructor(props) {
        super(props);

        // Definisce lo stato iniziale del componente.
        this.state = {
            input: this.props.preset
        }
    }

    // Esegue la codifica di Huffman.
    huffmanInputHandler(input) {

        let huffmanInputTable = this.calculateHuffmanProbabilityTable(input);

        /*
        huffmanInputTable = [
            { character: "A", order: 0, probability: 0.10 },
            { character: "B", order: 1, probability: 0.10 },
            { character: "C", order: 2, probability: 0.25 },
            { character: "D", order: 3, probability: 0.25 },
            { character: "E", order: 4, probability: 0.30 },
          ];
          */
        /*
        huffmanInputTable = [
            { character: "F", order: 0, probability: 0.015 },
            { character: "C", order: 1, probability: 0.015 },
            { character: "A", order: 2, probability: 0.025 },
            { character: "N", order: 3, probability: 0.025 },
            { character: "L", order: 4, probability: 0.03 },
            { character: "B", order: 5, probability: 0.05 },
            { character: "J", order: 6, probability: 0.05 },
            { character: "K", order: 7, probability: 0.05 },
            { character: "H", order: 8, probability: 0.05 },
            { character: "M", order: 9, probability: 0.1 },
            { character: "D", order: 10, probability: 0.1 },
            { character: "E", order: 11, probability: 0.145 },
            { character: "G", order: 12, probability: 0.145 },
            { character: "I", order: 13, probability: 0.2 }
          ];
          */

        if (huffmanInputTable.length <= 0 || input.length < 2) return;
        let huffman = new HuffmanAlgorithm(huffmanInputTable);

        const huffmanTree = huffman.reduce();
        const huffmanTreeRoot = huffmanTree[huffmanTree.length - 1].symbols[0];
        const huffmanCodes = huffman.calculateCodes(huffmanTreeRoot, "", 1, true);
        const huffmanNodes = huffman.getNodes();
        const huffmanInput = input;

        this.props.onHuffmanInputChanged(huffmanInput, huffmanTreeRoot, huffmanNodes, [...huffmanCodes]);
    }

    // Calcola la tabella con le probabilità dei simboli.
    calculateHuffmanProbabilityTable(input) {
        const asciiTable = [];
        for (let i = 0; i < 255; i++) {
            asciiTable.push(0);
        }

        let totalCharacters = 0;
        for (let i = 0; i < input.length; i++) {
            let ascii = input.charCodeAt(i);
            asciiTable[ascii] += 1;
            totalCharacters += 1;
        }

        const output = [];
        for (let i = 0; i < asciiTable.length; i++) {
            if (asciiTable[i] > 0) {
                const probability = asciiTable[i] / totalCharacters;
                const character = String.fromCharCode(i);
                output.push({ character, order: 0, probability });
            }
        }

        return output;
    }

    // Carica un file da utilizzare come input.
    showFile = async (e) => {
        e.preventDefault();

        // Legge il contenuto del file.
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = (e.target.result);
            this.huffmanInputHandler(text);
        };
        reader.readAsText(e.target.files[0], 'ISO 8859-1');
    }

    // Gestisce l'input del testo da codificare.
    inputHandler(event) {
        this.setState({ input: event.target.value });
    }

    render() {
        return (
            <div className="huffman-input">
                <div className="input-box">
                    <div className="input-header">
                        <p>Write a text to encode.</p>
                        <label className="custom-file-input">
                            <input type="file" onChange={(e) => this.showFile(e)} />
                        </label>
                    </div>
                    <div className="input-content">
                        <div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                this.huffmanInputHandler(this.state.input);
                            }} >
                                <textarea name="text"
                                    onChange={(event) => this.inputHandler(event)}
                                    value={this.state.input}
                                    placeholder="Write a text to encode ...">
                                </textarea>
                                <button onClick={() => {
                                    this.huffmanInputHandler(this.state.input);
                                }}>Encode the text
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default HuffmanInput;