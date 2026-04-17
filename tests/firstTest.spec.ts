import {expect, test} from '@playwright/test'

// Section 3 - Playright hands-on overview

// !! always use command "await" in front of Promise<Response> methods (e.g. page.goto) !!

// Function body:
// test.beforeAll(() => {

// })

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Suite1',() => {
   test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
})

    test('Navigate to form layouts', async ({page}) => {
    await page.getByText('Form Layouts').click()
})
    test('Navigate to datepicker page', async ({page}) => {
    await page.getByText('Datepicker').click()
})
})


test.describe('Suite2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/pages/tables'); // go directly to menu root

    // Wait for sidebar to render
    const tablesMenu = page.getByRole('link', { name: 'Tables & Data' });
    await tablesMenu.click();

    // Wait for submenu to expand
    await page.waitForSelector('a:has-text("Smart Table")');
  });

  test('Navigate to smart table', async ({ page }) => {
    await page.getByRole('link', { name: 'Smart Table' }).click();
    await expect(page).toHaveURL('http://localhost:4200/pages/tables/smart-table');
  });

  test('Navigate to tree grid', async ({ page }) => {
    await page.getByRole('link', { name: 'Tree Grid' }).click();
    await expect(page).toHaveURL('http://localhost:4200/pages/tables/tree-grid');
  });
})


// Section 4 - Interaction with web elements

// test.beforeEach(async({page}) => {
//     await page.goto('http://localhost:4200/')
//     await page.getByText('Forms').click()
//     await page.getByText('Form Layouts').click()
// })

// Locator syntax rules

test('Locator syntax rules', async({page}) => {
    // by Tag name
    await page.locator('input').first().click()

    // by ID
    page.locator('#inputEmail1')

    // by class value
    page.locator('.shape-rectangle')

    // by attribute
    page.locator('[placeholder="Email"]')

    // by class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator('text-is("Using the Grid")')
})

// User facing locators

test.skip('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: 'Email'}).first().click()
    await page.getByRole('button', {name: 'Sign in'}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Remember me').first().click()
    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()

    
})

// Locating child elements

test('Locating child elements' , async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() // preferred method to locate child elemets (more compact)
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click() // not preferred because of the long syntax and complexity

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click() // combination of regulator locator method + user-facing locator method

    await page.locator('nb-card').nth(3).getByRole('button').click() // try to avoid using index locator nth() ; index always starts from 0, so nth(3) is the 4th index
})

// Locating parent elements

test('Locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).first().click()

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).click()

    await page.locator('nb-checkbox label').filter({ hasText: 'Check me out' }).check() // method .check for checkboxes

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: 'Email'}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click() // XPATH NOT RECOMMENDED
})

// Reusing the locators

test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})
    // const passwordField = basicForm.getByRole('textbox', {name: 'Password'})

    await emailField.fill('test@test.com') // method .fill
    await basicForm.getByRole('textbox', {name: 'Password'}).fill('Welcome@123') // method .fill
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

// Extracting values

test('Extracting values', async({page}) => {
    // extract single text value: method .textContent
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // extract all text values: method .alltextContents
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1')

    // extract input value: method .inputValue
    const emailField = basicForm.getByRole('textbox', {name: ('Email')})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // extract attribute value: method .getAttribute
    const placeHolderValue = await emailField.getAttribute('placeholder')
    expect(placeHolderValue).toEqual('Email')
    

})

// Assertions

test('Assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button')
    
    // General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    // Locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertions - NOT RECOMMENDED
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
    
})
