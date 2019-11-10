import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './Navigation';

it('Navigation Loads', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Navigation />, div);
    ReactDOM.unmountComponentAtNode(div);
});