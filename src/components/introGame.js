import imgLogo from '../assets/img/LOGO_MCT.svg';

let logoPage = require('../Templates/logoPage.tpl');
let instructPage = require('../Templates/instructPage.tpl');

export default class App {

    constructor() {
        this.logoPage();
        this.beginGame();
    }

    logoPage() {
        document.querySelector('.home-container').innerHTML = logoPage;
        document.querySelector('.logo-img').src = imgLogo;

    }
    beginGame() {
        document.querySelector('.play-btn').addEventListener('click', () => {
            document.querySelector('.logo-container').classList.remove('logo-bounce')
            document.querySelector('.logo-container').classList.add('remove-item')
            document.querySelector('.play-btn').classList.add('remove-item')
            document.querySelector('.info-btn').classList.add('remove-item')
            document.querySelector('.sound-btn').classList.add('remove-item')
            this.instructPage();
        })
    }

    instructPage() {
        setTimeout(() => {
            document.querySelector('.logo-page').innerHTML = instructPage;
            for (let i = 0; i < document.querySelectorAll('.card').length; i++) {
                document.querySelectorAll('.card')[i].classList.add('appear-card');
            }
        }, 1000)

        //CHECK PLAYER
        window.addEventListener('keydown', (e) => {
            let keyCode = e.keyCode || e.which;
            if (keyCode == 90 || keyCode == 68 || keyCode == 83 || keyCode == 81) {
                document.querySelector('.player-1').classList.add('ready-player');
            }
            if (keyCode == 79 || keyCode == 77 || keyCode == 76 || keyCode == 75) {
                document.querySelector('.player-2').classList.add('ready-player');
            }
            if (keyCode == 38 || keyCode == 39 || keyCode == 40 || keyCode == 37) {
                document.querySelector('.player-3').classList.add('ready-player');
            }
            if (keyCode == 53 || keyCode == 51 || keyCode == 50 || keyCode == 49) {
                document.querySelector('.player-4').classList.add('ready-player');
            }
            //REMOVE CARD
            setTimeout(() => {
                if (document.querySelectorAll('.ready-player').length == 4) {
                    for (let i = 0; i < document.querySelectorAll('.card').length; i++) {
                        document.querySelectorAll('.card')[i].classList.remove('appear-card');
                    }
                    setTimeout(() => {
                        document.querySelector('.player-1').classList.add('remove-item')
                        setTimeout(() => {
                            document.querySelector('.player-2').classList.add('remove-item')
                            setTimeout(() => {
                                document.querySelector('.player-3').classList.add('remove-item')
                                setTimeout(() => {
                                    document.querySelector('.player-4').classList.add('remove-item')
                                }, 200)
                            }, 200)
                        }, 200)
                    }, 200)
                    //REMOVE INSTRUCT PAGE
                    setTimeout(() => {
                        document.querySelector('.logo-page').classList.add('remove-back') //remove back
                        setTimeout(() => {
                            //document.querySelector('.logo-page').remove();
                            document.querySelector('.home-container').remove();
                        }, 800)
                    }, 1400)
                }
            }, 1000)
        })
    }


}
