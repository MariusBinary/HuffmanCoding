
import { Component } from 'react';
import './HuffmanComparison.css';
import { bytesToSize, fillArray } from '../../utils/utils';
import EmptyTab from '../EmptyTab/EmptyTab';

class HuffmanComparison extends Component {

    generateASCIIOutput() {
        let output = [];
        let size = 0;

        for (let i = 0; i < this.props.source.length; i++) {
            let data = this.props.source.charCodeAt(i).toString(2);
            data = "00000000".substr(data.length) + data;
            size += data.length;
            output.push(data);
        }

        return { output, size };
    }

    generateHuffmanOutput() {
        let output = [];
        let size = 0;
        for (let i = 0; i < this.props.source.length; i++) {
            const character = this.props.source[i];
            const index = this.props.huffman.findIndex(symbol => symbol.character === character);

            if (index !== -1) {
                const data = this.props.huffman[index].code;
                size += data.length;
                output.push(data);
            }
        }
        return { output, size };
    }

    // Calcola l'entropia del codice.
    calculateEntropy() {
        let sum = 0;
        this.props.huffman.forEach(item => {
            sum += (item.probability * Math.log2(item.probability));
        });

        return (-sum).toFixed(4) + " bit/simbolo";
    }

    // Calcola la lunghezza media del codice.
    calculateMediumLength() {
        const symbols = fillArray(this.props.huffman[0].code.length + 1, 0);
        this.props.huffman.forEach(item => {
            const codeLength = item.code.length;
            symbols[codeLength] += item.probability;
        });

        let sum = 0;
        symbols.forEach((item, index) => {
            sum += (item * index);
        });

        return sum.toFixed(4) + " bits";
    }

    render() {

        if (this.props.source.length === 0) {
            return <EmptyTab />;
        }

        const ascii = this.generateASCIIOutput();
        const huffman = this.generateHuffmanOutput();

        let lastCodeColor = 0;
        const items = huffman.output.map((item, index) => {
            let bold = lastCodeColor === 0 ? "bold" : "normal";
            lastCodeColor = lastCodeColor === 0 ? 1 : 0;
            return (<span key={"huf-" + index} style={{ fontWeight: bold }}> {item} </span>);
        });

        let lastCodeColor1 = 0;
        const items1 = ascii.output.map((item, index) => {
            let bold = lastCodeColor1 === 0 ? "bold" : "normal";
            lastCodeColor1 = lastCodeColor1 === 0 ? 1 : 0;
            return (<span key={"asc-" + index} style={{ fontWeight: bold }}> {item} </span>);
        });

        let entropy = this.calculateEntropy();
        let mediumLength = this.calculateMediumLength();

        return (
            <div className="huffman-comparison">
                <div className="hilary">
                    <div className="transmission-flow">
                        <div className="tree-content comparison-info">
                            <p>Entropy = <strong>{entropy}</strong></p>
                        </div>
                    </div>
                    <div className="transmission-flow">
                        <div className="tree-content comparison-info">
                            <p>Average length = <strong>{mediumLength}</strong></p>
                        </div>
                    </div>
                </div>
                <div className="transmission-flow">
                    <div className="tree-header">
                        <p>Text encoded with <strong>ASCII</strong></p>
                        <p>Total size: <strong>{bytesToSize(ascii.size)}</strong></p>
                    </div>
                    <div className="tree-content">
                        <div className="bits-channel">
                            <div className="edit-channel" tabIndex="1">{items1}</div>
                        </div>
                    </div>
                </div>
                <div className="transmission-flow">
                    <div className="tree-header">
                        <p>Text encoded with <strong>Huffman</strong></p>
                        <p>Total size: <strong>{bytesToSize(huffman.size)}</strong></p>
                    </div>
                    <div className="tree-content">
                        <div className="bits-channel">
                            <div className="edit-channel" tabIndex="2">{items}</div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default HuffmanComparison;