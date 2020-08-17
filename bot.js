const puppeteer = require('puppeteer');
const creds = {
    email: "ejemplo@correo.es",
    password: "Ejemplo_De_Contraseña"
  };
  
  async function main(){
    const browser = await puppeteer.launch({
      headless: true,
      args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
      ]
    });
  
    const page = await browser.newPage();
  
    await page.goto("https://www.milanuncios.com/mis-anuncios");
    await page.type('input[name=email]', creds.email);
    await page.type('input[name=password]', creds.password)
    await Promise.all([
      page.keyboard.press('Enter'),
      //Esperamos a que aparezca el modal para continuar
      page.waitForSelector('#modal-react-portal > div.sui-MoleculeModal.is-MoleculeModal-open > div > div.sui-MoleculeModal-content.sui-MoleculeModal-content--without-indentation > div > div.ma-ModalOnboardingReserved-content > div.ma-ModalOnboardingReserved-contentFooter > div.ma-ModalOnboardingReserved-contentFooterButton > button'),
    ]);
    //Cerramos el modal
    await page.click('#modal-react-portal > div.sui-MoleculeModal.is-MoleculeModal-open > div > div.sui-MoleculeModal-content.sui-MoleculeModal-content--without-indentation > div > div.ma-ModalOnboardingReserved-content > div.ma-ModalOnboardingReserved-contentFooter > div.ma-ModalOnboardingReserved-contentFooterButton > button');
    //Hacemos scroll hasta el final
    await autoScroll(page);
    //Obtenemos la cadena con el nº de anuncios y se guarda en value
    let element = await page.$('#app > div > div > div.ma-AdvertisementPageLayout > div.ma-AdvertisementPageLayout-left > div.ma-LayoutApplication-content > div.ma-LayoutBasic-content > div.ma-LayoutBasicMainContent > div > main > div > p');
    let value = await page.evaluate(el => el.textContent, element);
    let separa = await value.split(" ");
    await console.log(separa[0]);
    //Bucle para ir renovando
    await renovar(page,separa[0]);
    //await page.screenshot({path: 'buddy-screenshot.png'});
    await browser.close();
  }
  
  async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
  
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  }
  
  async function renovar(page,num){
    console.log('Inicio del bucle de renovar')
    for (let index = 1; index <= num; index++) {
      await page.click(`#app > div > div > div.ma-AdvertisementPageLayout > div.ma-AdvertisementPageLayout-left > div.ma-LayoutApplication-content > div.ma-LayoutBasic-content > div.ma-LayoutBasicMainContent > div > main > div > div.ma-AdList > div:nth-child(${index}) > div > article > footer > ul > li:nth-child(2) > button`);
      await page.waitFor(250);
    }
    console.log('Fin del bucle de renovar')
  }
  
  main();