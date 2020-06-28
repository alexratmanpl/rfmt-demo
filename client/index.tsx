import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let props = {
    ancestor: '',
    descendants: [],
    element: {
        ancestors: [],
        descendants: [],
        gloss: '',
        size: [],
        wnid: '',
        words: '',
    },
    largest: [],
    root: '',
};
const script = document.getElementById('__APP_INITIAL_DATA__');
if (script) {
    if ((window as any).__APP_INITIAL_DATA__) {
        props = (window as any).__APP_INITIAL_DATA__;
        delete (window as any).__APP_INITIAL_DATA__;
    }
    script.remove();
}

ReactDOM.render(
    <React.StrictMode>
        <App {...props}/>
    </React.StrictMode>,
    document.getElementById('root'),
);
