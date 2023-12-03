const puppeteer = require('puppeteer');

const USER = 'jlmm0021';
const PASSWORD = 'Cachimbero520';

(async () => {
  const browser = await puppeteer.launch(); 
  const page = await browser.newPage(); // Abre una nueva página
  
  // Navega a la URL proporcionada
  await page.goto('https://uja.i2a.es/CronosWeb/Login');

  // Espera a que se cargue la página y busca todos los elementos con la clase especificada
  const elements = await page.$$('.navigation-section-widget-collection-item.navigation-section-widget-collection-item-image');
  
  // Hacer clic en el segundo elemento encontrado (si existe)
  if (elements.length >= 2) {
    await elements[1].click(); // Hace clic en el segundo artículo
  } else {
    console.error('No se encontró el segundo elemento.');
  }

  // Rellena el campo de usuario y contraseña con las constantes definidas
  await page.waitForSelector('#username');
  await page.type('#username', USER);
  
  await page.waitForSelector('#password');
  await page.type('#password', PASSWORD);

  // Haz clic en el botón de submit
  await page.click('#submit_button');

  // Espera un momento para que puedas ver el resultado antes de cerrar el navegador (puedes ajustar el tiempo según necesites)
  await page.waitForTimeout(5000);

  await browser.close(); // Cierra el navegador
})();
