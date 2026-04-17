import { Locator, Page } from "@playwright/test";

export class LoginPage{

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    // Locators inside of the methods (as recommended by trainer in lesson 48)

    async openMyAccountPage(){
        await this.page.locator('.user-info').click()
        
    }

    async loginFlow(email: string, password: string, clickRememberMe: boolean){
        await this.page.locator('.login-form .form-row.username input[placeholder="Votre e-mail*"]').last().fill(email) //fill in email address
        await this.page.locator('input[placeholder="Mot de passe*"]').last().fill(password) //fill in password


    if(clickRememberMe){
        await this.page.locator('.login-rememberme').click() //select 'Remember me' checkbox
        
    }

        await this.page.getByRole('button', {name: 'Connexion'}).click() //login into user account
    }

    // async inputLoginCredentials(email: string, password: string){
    //     await this.page.locator('.login-form .form-row.username input[placeholder="Votre e-mail*"]').last().fill(email) //fill in email address
    //     await this.page.locator('input[placeholder="Mot de passe*"]').last().fill(password) //fill in password

    // }

    // async clickRememberMe(){
    //     await this.page.locator('.login-rememberme').click() //select 'Remember me' checkbox
    // }

    // async clickLoginCTA(){
    //     await this.page.getByRole('button', {name: 'Connexion'}).click() //login into user account
    // }

    
}