import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
//import {Screen, State, UI} from 'simplified-ui';

class TestCompo extends React.Component {}

function getName(compo) {
    console.log(compo);
}

getName(<TestCompo/>);

/**

ReactDOM.render(<UI.Body path={window.location.pathname}>
THE LOADER GOES HERE
</UI.Body>, document.getElementById('root'));
 **/