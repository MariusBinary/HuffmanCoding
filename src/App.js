import './App.css';
import { Component } from 'react';

import HuffmanTree from './components/HuffmanTree/HuffmanTree';
import HuffmanTable from './components/HuffmanTable/HuffmanTable';
import HuffmanComparison from './components/HuffmanComparison/HuffmanComparison';
import NavigationBar from './components/NavigationBar/NavigationBar';
import HuffmanInput from './components/HuffmanInput/HuffmanInput';
import { ReactComponent as IcTheme } from './assets/ic_theme.svg';
import { ReactComponent as IcLogo } from './assets/ic_logo.svg';

class App extends Component {

  constructor(props) {
    super(props);

    // Recupera il tema salvato in memoria.
    let theme = localStorage.getItem("theme");
    if (theme === undefined || theme === null) {
      theme = 0;
    } else {
      theme = parseInt(theme)
    }

    // Definisce lo stato iniziale del componente.
    this.state = {
      huffmanInputData: "",
      huffmanOutputTree: null,
      huffmanOutputTable: [],
      huffmanOutputNodes: [],
      theme: theme,
      page: '/input'
    }
  }

  // Quando la codifica di Huffman è stata effettuata, salvare 
  // i risultati della codifica e reindirizzare l'utente alla
  // pagina del diagramma di Huffman.
  onHuffmanInputChanged(data, tree, nodes, table) {
    this.setState({
      huffmanInputData: data,
      huffmanOutputTree: tree,
      huffmanOutputNodes: nodes,
      huffmanOutputTable: table,
      page: '/diagram'
    });
  }

  // Quando il tema è stato cambiato, salvarlo in memoria.
  themeChangeHandler() {
    const theme = this.state.theme === 0 ? 1 : 0;
    this.setState({ theme: theme }, () => {
      localStorage.setItem("theme", theme);
    });
  }

  navigateTo(url) {
    this.setState({
      page: url
    });
  }

  render() {

    let content = null;
    switch (this.state.page) {
      case '/input':
        content = <HuffmanInput preset={this.state.huffmanInputData}
          onHuffmanInputChanged={(data, tree, nodes, table) =>
            this.onHuffmanInputChanged(data, tree, nodes, table)} />;
        break;
      case '/diagram':
        content = <HuffmanTree source={this.state.huffmanOutputNodes} />
        break;
      case '/table':
        content = <HuffmanTable source={this.state.huffmanOutputTable} />
        break;
      case '/comparison':
        content = <HuffmanComparison source={this.state.huffmanInputData}
          huffman={this.state.huffmanOutputTable} />
        break;
    }

    return (
      <div className="app" data-theme={this.state.theme === 1 ? "dark" : null}>
        <header className="app-header">
          <div className="header-main">
            <IcLogo className="logo" />
            <div>
              <h1 className="header-title">Huffman coding</h1>
              <p className="header-author">This tool allows you to encode text using
              <a href="https://it.wikipedia.org/wiki/Codifica_di_Huffman" target="_blank">huffman</a>
               encoding.</p>
            </div>
          </div>
          <button className="theme-btn" onClick={() => this.themeChangeHandler()}>
            <IcTheme />
          </button>
        </header>
        <div className="app-content">
          <NavigationBar page={this.state.page} naviagateTo={(url) => this.navigateTo(url)} />
          <div className="huffman-wrapper">
            {content}
          </div>
        </div>
      </div >
    );
  }
}

export default App;
