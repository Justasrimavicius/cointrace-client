import { render, screen, cleanup, afterEach, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';

import Header from '../Components/Header';
import App from '../Components/Routes/App'
test('renders header', () => {

    render(<Router><Header props={{}}/></Router>)
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
});

describe('renders unauthenticated header view',()=>{

    test('login button in header',()=>{
        render(<Router><Header props={{}}/></Router>)

        const loginButton = screen.getByTestId('loginButton');
        fireEvent.click(loginButton);

        const loginPopup = screen.getByTestId('loginPopup');
        expect(loginPopup).toBeInTheDocument();

    })
});

describe('renders authenticated header view',()=>{
    test('logout button in header',()=>{
        render(<Router><Header props={{loggedIn:true}}/></Router>)

        const logoutButton = screen.getByText('Log out');
        expect(logoutButton).toBeInTheDocument();

    })
    test('avatar in header',()=>{
        sessionStorage.setItem('user','HCjEpM5ec2SU8FPJvX4zADFHE3u1');
        render(<Router><Header props={{loggedIn:true}}/></Router>);

        const avatar = screen.getByTestId('avatar');
        expect(avatar).toBeInTheDocument();

    })
})

test('renders both signups - from App.js and from Header.js',()=>{
    render(<App />);
    const signup = screen.getAllByText('Sign up');
    expect(signup).toHaveLength(2);
})