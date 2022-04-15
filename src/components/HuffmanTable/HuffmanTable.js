
import { Component } from 'react';
import EmptyTab from '../EmptyTab/EmptyTab';
import './HuffmanTable.css';

class HuffmanTable extends Component {

    getASCIIBinary(text) {
        let data = text.charCodeAt(0).toString(2);
        data = "00000000".substr(data.length) + data;
        return data;
    }

    getASCIIHex(text) {
        let data = text.charCodeAt(0).toString(16);
        data = "0x" + data;
        return data;
    }

    render() {

        if (this.props.source.length === 0) {
            return <EmptyTab />;
        }

        return (
            <div className="huffman-table">
                <div className="table-header">
                    <p>Huffman encoding output table.</p>
                </div>
                <div className="table-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Probability</th>
                                <th>Huffman code</th>
                                <th>ASCII code(BIN)</th>
                                <th>ASCII code (HEX)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.source.map((row, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{row.character}</td>
                                            <td>{row.probability.toFixed(10)}%</td>
                                            <td>{row.code}</td>
                                            <td>{this.getASCIIBinary(row.character)}</td>
                                            <td>{this.getASCIIHex(row.character)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </div>);
    }
}

export default HuffmanTable;