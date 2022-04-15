
import React from 'react';
import './NavigationBar.css';
import { ReactComponent as IcMenuInput } from '../../assets/ic_menu_input.svg';
import { ReactComponent as IcMenuDiagram } from '../../assets/ic_menu_diagram.svg';
import { ReactComponent as IcMenuTable } from '../../assets/ic_menu_table.svg';
import { ReactComponent as IcMenuComparison } from '../../assets/ic_menu_comparison.svg';

const navigationBar = (props) => {

    const menu = [
        { url: "/input", title: "Input", icon: <IcMenuInput /> },
        { url: "/diagram", title: "Huffman diagram", icon: <IcMenuDiagram /> },
        { url: "/table", title: "Coding table", icon: <IcMenuTable /> },
        { url: "/comparison", title: "Comparison", icon: <IcMenuComparison /> }
    ]

    const selected = menu.findIndex(item => item.url === props.page);

    return (
        <div className="navigation-bar">
            <ul>
                {
                    menu.map((item, index) => {
                        return <li key={index}
                            className={selected === index ? "active" : null}
                            onClick={() => props.naviagateTo(menu[index].url)}>
                            <div>{item.icon}</div>
                            <p>{item.title}</p>
                        </li>
                    })
                }
            </ul>
        </div >
    );
};

export default navigationBar;