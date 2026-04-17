import {expect, test} from '@playwright/test'
import { first } from 'rxjs-compat/operator/first'

test.beforeEach(async({page}) => {
    await page.goto('/')
    
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input Fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})

        await usingTheGridEmailInput.fill('test1@domain.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@domain.com')

        // Generic assertion

        const inputValueEmail = await usingTheGridEmailInput.inputValue()
        expect(inputValueEmail).toEqual('test2@domain.com')

        // Locator assertion

        await expect(usingTheGridEmailInput).toHaveValue('test2@domain.com')

    })

    test('Radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})

        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
        
        // General assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()
        
        // Locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy
        
    })
    
})

test('Checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})

    const allBOxes = page.getByRole('checkbox')
    for( const box of await allBOxes.all()){
        // check all checkboxes
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
        // uncheck all checkboxes
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
        
    }

})

test('Lists and dropdowns', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select') // get dropdown menu locator
    await dropdownMenu.click() // click on dropdown menu locator to open dropdown list

    // Recommended way to interact with a list

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has a LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option') // get dropdown list locator
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']) // make assertion that locator is correct
    await optionList.filter({hasText: 'Cosmic'}).click() // select a value from dropdown list

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    // Colors array
    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)'
    }

    await dropdownMenu.click()
    // For-in loop
    for(const color in colors){
        await optionList.filter({hasText: color}).click() // hasText: color will take the first elements of the array, eg.'Light'
        await expect(header).toHaveCSS('background-color', colors[color]) // colors[color] will take the second elements of the array, eg. 'rgb(255, 255, 255)'
        if(color != 'Corporate')
            await dropdownMenu.click()
    }
})

test('Tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await tooltipCard.getByRole('button', {name: 'Top'}).hover()

    // page.getByRole('tooltip') // works only if you have a role tooltip created

    const tooltipMessage = await page.locator('nb-tooltip').textContent()
    expect(tooltipMessage).toEqual('This is a tooltip')

})

test('Browser dialog boxes', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

// Accept a browser dialog box
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Regular dialog boxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()

    const dialogCard = page.locator('nb-card').getByRole('button', {name: 'Open Dialog with component'})
    await dialogCard.click()

    const dialogBox = page.locator('ngx-showcase-dialog')
    await expect(dialogBox).toContainText('This is a title passed to the dialog component')

    await page.locator('nb-dialog-container').getByRole('button', {name: 'Dismiss Dialog'}).click()
    expect(dialogBox).not.toBeVisible
})

test('Web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1 get the row by any text in this row
    
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('99')
    await page.locator('.nb-checkmark').click()

    // 2 get the row based on the value in the specific column
    
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@domain.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@domain.com')

    // 3 test filter of the table

    const ages = ['20', '30', '40', '200']

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)

        const ageRows = page.locator('tbody tr')
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent() 

            if(age == '200'){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else{
                expect(cellValue).toEqual(age)
            }
   
            
        }
    }

})

test('Datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const formPicker = page.getByPlaceholder('Form Picker')
    await formPicker.click()

    let date = new Date()
    date.setDate(date.getDate() + 14)

    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

    // while loop
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click() // use boolean 'exact' to get exact value from calendar
    await expect(formPicker).toHaveValue(dateToAssert)
})

test('Sliders', async({page}) => {
    // Update slider attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '163.064')
    //     node.setAttribute('cy', '11.715')
    // })
    // await tempGauge.click()

    // Simulate mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() //useful when needing to scroll elements into view

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x+100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
    
})

