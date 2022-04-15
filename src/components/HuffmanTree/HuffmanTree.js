
import { Component } from 'react';
import './HuffmanTree.css';
import { fillArray } from '../../utils/utils';
import EmptyTab from '../EmptyTab/EmptyTab';

import { ReactComponent as IcDiagramPlay } from '../../assets/ic_diagram_play.svg';
import { ReactComponent as IcDiagramPause } from '../../assets/ic_diagram_pause.svg';
import { ReactComponent as IcDiagramSkip } from '../../assets/ic_diagram_skip.svg';
import { ReactComponent as IcDiagramBack } from '../../assets/ic_diagram_back.svg';

class HuffmanTree extends Component {

    constructor(props) {
        super(props);

        this.canvasHeightViewport = 0;
        this.nodes = [];
        this.tempLabels = [];

        // Definisce lo stato iniziale del componente.
        this.state = {
            selectedStep: this.props.source.length - 1,
            isHighlighted: -1,
            autoPlay: false,
        }
    }

    static defaultProps = {
        canvasWidth: 800,
        canvasHeight: 600,
        symbolWidth: 100,
        symbolHeight: 100,
        symbolGap: 20,
        nodeHeight: 100,
    };
    
    // Disegna i simboli.
    drawSymbols(symbols) {
        return symbols.map((symbol, index) => {
            const x = (index * (this.props.symbolWidth + this.props.symbolGap));
            const isHighlighted = index === (this.state.isHighlighted);

            return (
                <g key={index}
                    onMouseEnter={() => this.symbolEnterHandler(index)}
                    onMouseLeave={() => this.symbolLeaveHandler(index)}>
                    <rect x={x} y="0" width={this.props.symbolWidth} height={this.props.symbolHeight}
                        fill={isHighlighted ? "var(--diagram-active-color)" : "var(--diagram-symbol-color)"}></rect>
                    <rect x={x + 5} y="68" height={2} width={90} fill="white"></rect>
                    <text x={x + 28} y="60" fontSize="64" fill="white">{symbol.character}</text>
                    <text x={x + 13} y={92} fontSize="24" fill="white">{symbol.probability.toFixed(4)}</text>
                </g>
            );
        });
    }

    // Disegna i nodi di collegamento.
    drawNodes(nodes) {

        const offsets = fillArray(nodes[0].symbols.length, 1);
        const nodesTemp = fillArray(nodes.length, 0);
        const hierarchy = fillArray(64, 0);

        // Se devo fermarmi ad uno step specifico, rimuovo tutti gli step successivi.
        const realNodes = [...nodes];
        if (this.state.selectedStep !== -1) {
            realNodes.splice(this.state.selectedStep + 1, Infinity);
        }

        // Disegno i singoli nodi.
        realNodes.forEach((node, index) => {
            if (index === 0) return;

            let leftOffset = offsets[node.x1];
            let rightOffset = offsets[node.x2];
            let maxOffset = Math.max(leftOffset, rightOffset);

            // Controlla se su livello del nodo ci sono altri nodi con il quale può 
            // andare a collidere. Se ci sono passare al livello successivo.
            let isHierarchyLevelValid = false;
            while (!isHierarchyLevelValid) {
                if (!this.isNodeColliding(hierarchy[maxOffset], node.x1)) {
                    offsets[node.x1] += maxOffset - leftOffset + 1;
                    isHierarchyLevelValid = true;
                } else {
                    maxOffset += 1;
                }
            }

            const path1 = nodesTemp[node.x1] === 0 ? [node.x1] : nodesTemp[node.x1];
            const path2 = nodesTemp[node.x2] === 0 ? [node.x2] : nodesTemp[node.x2];

            const hierarchyNode = {
                x1: node.x1,
                x2: node.x2,
                offset1: leftOffset,
                offset2: rightOffset,
                path1: [...path1],
                path2: [...path2],
                probability: node.probability,
            };

            if (nodesTemp[node.x1] === 0) {
                nodesTemp[node.x1] = [node.x1, node.x2];
            } else {
                if (nodesTemp[node.x2] === 0) {
                    nodesTemp[node.x1].push(node.x2);
                } else {
                    const array3 = nodesTemp[node.x1].concat(nodesTemp[node.x2]);
                    nodesTemp[node.x1] = array3;
                }
            }

            if (nodesTemp[node.x2] === 0) {
                nodesTemp[node.x2] = [node.x2];
            } else {
                nodesTemp[node.x2].push(node.x2);
            }

            this.addToArray(hierarchy, maxOffset, hierarchyNode);
        });

        const result = hierarchy.filter(node => node !== 0);

        const { symbolHeight, symbolWidth, symbolGap, nodeHeight } = this.props;
        this.tempLabels = [];

        return result.map((item, levelIndex) => {
            return item.nodes.map((node, nodeIndex) => {

                // Calcola le coordinate delle linee.
                const levelOffset = (symbolHeight) + ((levelIndex + 1) * nodeHeight);
                const xOffset = (symbolWidth / 2);
                const x1Gap = node.x1 * symbolGap;
                const x1 = xOffset + x1Gap + (node.x1 * symbolWidth);
                const x2Gap = (node.x2) * symbolGap;
                const x2 = xOffset + x2Gap + (node.x2 * symbolWidth);

                // Calcola l'altezza massima del canvas.
                this.canvasHeightViewport =
                    Math.max(this.canvasHeightViewport, levelOffset + 140);

                const nodeHighlighted = this.state.isHighlighted !== -1;
                const isHighlighted1 = node.path1.includes(this.state.isHighlighted);
                const isHighlighted2 = node.path2.includes(this.state.isHighlighted);

                // Salva le etichette per aggiungerle dopo con una priorità maggiore.
                this.tempLabels.push(this.drawText(nodeHighlighted, x1 - 35, levelOffset + 40, node.probability.toFixed(4)));

                // Disegna le linee.
                return (
                    <g key={levelIndex + "-" + nodeIndex}>
                        {this.drawNode(isHighlighted1, nodeHighlighted, x1, node.offset1 * nodeHeight, x1, levelOffset)}
                        {this.drawNode(isHighlighted2, nodeHighlighted, x1, levelOffset, x2, levelOffset)}
                        {this.drawNode(isHighlighted2, nodeHighlighted, x2, node.offset2 * nodeHeight, x2, levelOffset)}
                        {this.draw01(isHighlighted1, x1 - 35, levelOffset + 5, "1")}
                        {this.draw01(isHighlighted2, x2 + 35, levelOffset + 5, "0")}
                    </g>
                );
            });
        });
    }

    addToArray(array, index, item) {
        if (array[index] === 0) {
            array[index] = { nodes: [item] };
        } else {
            array[index].nodes.push(item);
        }
    }

    isNodeColliding(level, x1) {
        if (level === 0) return false;
        for (let i = 0; i < level.nodes.length; i++) {
            const node = level.nodes[i];
            if (x1 <= node.x2) {
                return true;
            }
        }
        return false;
    }

    // Scrive un testo alle coordinate indicate.
    draw01(isHighlighted, x, y, text) {
        return (
            <g>
                <rect x={x - 5} y={y - 20} width={22} height={24}
                    fill={isHighlighted ? "var(--diagram-active-color)" : "var(--diagram-label-path-color)"}></rect>
                <text x={x} y={y} fontSize="24" fontWeight="bold" fill="white">{text}</text>
            </g>
        );
    }

    // Scrive un testo alle coordinate indicate.
    drawText(hidden, x, y, text) {
        return (
            <g>
                <rect x={x - 5} y={y - 20} width={82} height={24}
                    fill={hidden ? "var(--diagram-label-disabled-color)" : "var(--diagram-label-prob-color)"}></rect>
                <text x={x} y={y} fontSize="24" fill="white">{text}</text>
            </g>
        );
    }

    // Disegna una linea alle coordinate indicate.
    drawNode(isHighlighted, hidden, x1, y1, x2, y2) {
        return (
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                strokeWidth={isHighlighted ? 10 : 5}
                stroke={isHighlighted ? "var(--diagram-active-color)" : (hidden ? "var(--diagram-node-disabled-color)" : "var(--diagram-node-color)")}
                strokeLinecap="round">
            </line>
        );
    }

    symbolEnterHandler(index) {
        this.setState({ isHighlighted: index });
    }

    symbolLeaveHandler(index) {
        this.setState({ isHighlighted: -1 });
    }

    // Gestisce il pulsante di riproduzione/pausa.
    playClickHandler() {
        const autoPlay = this.state.autoPlay;

        if (!autoPlay) {
            this.autoplayTimer = setInterval(() => {
                if (!this.skipClickHandler()) {
                    clearInterval(this.autoplayTimer);
                    this.setState({ autoPlay: false });
                }
            }, 1000);
            this.setState({ autoPlay: true });
        } else {
            if (this.autoplayTimer !== null) {
                clearInterval(this.autoplayTimer);
                this.setState({ autoPlay: false });
            }
        }
    }

    // Gestisce il pulsante indietro.
    backClickHandler() {
        const nextStep = this.state.selectedStep;

        if (nextStep - 1 >= 1) {
            this.setState({ selectedStep: nextStep - 1 });
            return true;
        } else {
            return false;
        }
    }

    // Gestisce il pulsante avanti.
    skipClickHandler() {
        const nextStep = this.state.selectedStep;
        const maxSteps = this.props.source.length;

        if (nextStep + 1 < maxSteps) {
            this.setState({ selectedStep: nextStep + 1 });
            return true;
        } else {
            return false;
        }
    }

    // Imposta lo step di disegno del diagramma indicato.
    setStepHandler(event) {
        this.setState({
            selectedStep: parseInt(event.target.value)
        });
    }

    render() {

        console.log("----> I'M UPDATING....");
        this.canvasHeightViewport = 0;
        if (this.props.source.length === 0) {
            return <EmptyTab />;
        }

        const symbols = this.drawSymbols(this.props.source[0].symbols);
        const nodes = this.drawNodes(this.props.source);
        const labels = this.tempLabels;

        let viewBoxHeight = this.canvasHeightViewport;
        let viewBoxWidth = this.props.source[0].symbols.length *
            (this.props.symbolWidth + this.props.symbolGap);

        return (
            <div className="huffman-tree">
                <div className="tree-header">
                    <p>Graphical representation of the Huffman coding.</p>
                    <div className="header-controls">
                        <div>
                            <label htmlFor="title">Draw the diagram up to: </label>
                            <select value={this.state.selectedStep} onChange={event => this.setStepHandler(event)}>
                                {
                                    this.props.source.map((item, index) => {
                                        if (index === 0) return null;
                                        return (
                                            <option key={index} value={index}>{"step: " + index}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <button className="tree-control-button" onClick={() => this.backClickHandler()}>
                            <IcDiagramBack />
                        </button>
                        <button className="tree-control-button" onClick={() => this.playClickHandler()}>
                            {this.state.autoPlay ? <IcDiagramPause /> : <IcDiagramPlay />}
                        </button>
                        <button className="tree-control-button" onClick={() => this.skipClickHandler()}>
                            <IcDiagramSkip />
                        </button>
                    </div>
                </div>
                <div className="tree-content">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width={this.props.canvasWidth} height={this.props.canvasHeight}
                        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
                        {symbols}
                        {nodes}
                        {labels}
                    </svg>
                </div>
            </div>);
    }
}

export default HuffmanTree;