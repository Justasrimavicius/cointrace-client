describe('cointrace test', () => {
  it('purchasing bitcoin', () => {
    // logins

    cy.visit('http://localhost:3000/');
    cy.findByRole('button', { name: /log in/i }).click();
    cy.findByTestId('loginEmail').type('testing3@gmail.com');
    cy.findByTestId('loginPassword').type('testing3');
    cy.findByTestId('loginButtonFinal').click();

    // goes to portfolio tab
    cy.findByText(/portfolio/i).click();

    // checks current balance
    cy.wait(5000);
    let oldBalance;
    cy.findByTestId('fiatAmount-portfolio').then(balance=>{
      oldBalance=balance[0].innerText.slice(0,balance[0].innerText.length-1);
    });

    // checks current amount of bitcoin in portfolo tab
    cy.wait(5000);
    let oldBtc;
    cy.findByTestId('bitcoin-price-testing').then(oldBtcValue=>{
      oldBtc = oldBtcValue[0].innerText.slice(0,oldBtcValue[0].innerText.length-1);
    })
    



    // buys bitcoin through trade tab
    cy.findByText(/trade/i).click();



    cy.findByRole('textbox').type('bitcoin');
    cy.findByRole('button', { name: /buy/i }).click();
    cy.findByRole('textbox', { name: /fiat amount/i }).type('10');
    cy.wait(1000)
    cy.findByRole('button', { name: /continue/i }).click();
    cy.wait(5000)
    // closes the tab
    cy.findByRole('button', { name: /x/i }).click();


    // checks the balance again
    cy.findByText(/portfolio/i).click();
    cy.wait(5000);
    let newBalance;
    cy.findByTestId('fiatAmount-portfolio').then(balance=>{
      newBalance=balance[0].innerText.slice(0,balance[0].innerText.length-1);
      // console.log(oldBalance);
      // console.log(newBalance);
      expect(Math.round((parseFloat(oldBalance)-parseFloat(newBalance)))).to.equal(10);
    });

    // checks if bitcoin got added to portfolio
    cy.findByTestId('bitcoin-price-testing').then(newBtcValue=>{
      const newBtc = newBtcValue[0].innerText.slice(0, newBtcValue[0].innerText.length-1);
      expect(parseFloat(newBtc)).to.be.greaterThan(parseFloat(oldBtc));
      // console.log(oldBtc);
      // console.log(newBtc);
    })

    // logouts
    cy.findByTestId('logout-btn-leftPanel').click();
    cy.findByRole('heading', { name: /begin by signing up/i }).then(loggedOutHeading=>{
      expect(loggedOutHeading).to.exist;
    })

  })
})