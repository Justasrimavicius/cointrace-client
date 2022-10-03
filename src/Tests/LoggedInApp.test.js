import { render, screen, cleanup, afterEach, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';

import renderer from 'react-test-renderer';

import LoggedInApp from '../Components/Routes/LoggedInApp'
import Home from '../Components/LoggedInApp_Sections/Home';
import Trade from '../Components/LoggedInApp_Sections/Trade';
import Portfolio from '../Components/LoggedInApp_Sections/Portfolio';


test('renders header', () => {

    render(<Router><LoggedInApp/></Router>)

    const loggedInApp = screen.getByTestId('LoggedInApp');
    expect(loggedInApp).toBeInTheDocument();
});

describe('LoggedInApp sections',()=>{
    test('home section',()=>{
        const tree = renderer.create(<Home />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table of crypto coins loads in home',async ()=>{
        render(<Home />)
        const table = screen.getByTestId('home-table');
        expect(table).toBeInTheDocument();
    });
    test('portfolio section',()=>{
        const tree = renderer.create(<Portfolio />).toJSON();
        expect(tree).toMatchSnapshot();
    })
    test('trade section',()=>{
        const tree = renderer.create(<Trade />).toJSON();
        expect(tree).toMatchSnapshot();
    })
});
