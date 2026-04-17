import {expect} from '@playwright/test'
import { Page } from "@playwright/test";

export class PlaceOrderFlow{

    readonly page: Page
    
    constructor(page: Page){
        this.page = page

    }


    // Locators inside of the methods (as recommended by trainer in lesson 48)

    async catLingerie(){
        const catLingerie = this.page.locator('.has-sub-menu').getByRole('link', {name: 'Lingerie'})
        await catLingerie.hover() //open hover menu for category Lingerie
    }

    async sansArmaturesCat(){
        const sansArmaturesLink = this.page.getByRole('link', {name: 'sans armatures'})
        await expect(sansArmaturesLink).toBeVisible()
        await(sansArmaturesLink).click()
    }

    async plpTile(){
        const plpTile = this.page.locator('#primary').getByRole('img').nth(0)
        await plpTile.click() //click on the first product tile image from the PLP
    }

    async pdpSizeSelector(){
        const sizeSelector = this.page.locator('.selection').getByText('Sélectionnez une taille')
        await expect(sizeSelector).toBeVisible() //PDP opened
        await sizeSelector.click() //open size selector
    }

    async availableSize(){
        const firstAvailableSize = this.page.locator('li[role="option"]:not(:has(.option-notselectable))').first()
        await(firstAvailableSize).click() // select first available size that's not OOS
    }
    
    async addToCartCTA(){
        const addToCartButton = this.page.getByRole('button').getByText('Ajouter au panier')
        await(addToCartButton).click() //add to cart
    }

    async showTheCart(){
        const miniCart = this.page.getByRole('link', {name: 'Afficher le panier'})
        await expect(miniCart).toBeVisible()
        await(miniCart).click()
    }

    async validateCart(){
        const validateCartButton = this.page.getByRole('button', {name: 'VALIDER MON PANIER'})
        await(validateCartButton).click() //validate cart and proceed to checkout
    }

    async loginOption(){
        const sidePanelLogin = this.page.locator('.cart-page-login-panel-form-title', { hasText: 'Se connecter' }).locator('input[type="radio"]')
        await expect(sidePanelLogin).toBeVisible()
        await(sidePanelLogin).check()
        await expect(sidePanelLogin).toBeChecked()
    }

    async loginCredentials(){
        const emailField = this.page.locator('[placeholder="Votre e-mail*"]')
        await emailField.fill('cristithetester@gmail.com') //fill in email

        const passField = this.page.locator('[placeholder="Mot de passe*"]').first()
        await passField.fill('R@ndompass1') //fill in password
    }

    async rememberMeBox(){
        const rememberMe = this.page.getByRole('checkbox', {name: 'Se souvenir de moi'})
        await rememberMe.check() //check box 'Remember me'
    }

    async loginButton(){
        const loginButton = this.page.getByRole('button', {name: 'Connexion'})
        await loginButton.click()
    }

    async nextStepButton(){
        const nextStepCTA = this.page.getByRole('button', {name: 'ÉTAPE SUIVANTE'})
        await nextStepCTA.click()
    }

    async cvvCOde(){
        const cardContainer = this.page.getByLabel(/La carte enregistrée se termine en/).first() //use the first saved credit card
        const cvvFrame = cardContainer.frameLocator("iframe[title='Iframe pour le code de sécurité']")
        await cvvFrame.locator("input[data-fieldtype='encryptedSecurityCode']").fill("737") //fill in CVV nr for saved credit card
    }

    async phoneNumberFill(){
        const phoneNumberField = this.page.locator('#telPudo')
        await phoneNumberField.click()
        await phoneNumberField.fill('612345678')
    }

    async acceptTc(){
        const tcCheckbox = this.page.locator('#payment-security-btn:visible')
        await tcCheckbox.scrollIntoViewIfNeeded()
        await tcCheckbox.check() //check the T&C box
    }

    async placeOrderButton(){
        const placeOrderCTA = this.page.getByRole('button', {name: 'PAYER ET TERMINER'})
        await placeOrderCTA.click() //place order
    }

}