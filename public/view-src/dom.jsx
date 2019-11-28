import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Screen, State, UI} from 'simplified-ui';

// front-page
Screen.addScren('/', {
    requireLogin: true,
    state: {
        title: 'Front Page',
        template: 'THE FRONT PAGE'
    }
});

ReactDOM.render(<UI.Body path={window.location.pathname}>
THE LOADER GOES HERE
</UI.Body>, document.getElementById('root'));