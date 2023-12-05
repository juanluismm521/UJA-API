const express = require("express");
const puppeteer = require("puppeteer");
require("dotenv").config();
const cors = require('cors');
const app = express();
const PORT = 80;

app.use(express.json());

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).send("Hola, bienvenido a la Juanlu API");
});

// Ruta para el login
app.post("/login", async (req, res) => {
  const { usuario, clave } = req.body;

  console.log("Usuario: ", usuario);
  console.log("Clave: ", clave);

  // Iniciar Puppeteer
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  try {
    // Ir a la página de inicio de sesión
    await page.goto("https://platea.ujaen.es/login/index.php");

    // Esperar a que el botón "SIDUJA" esté disponible y hacer clic en él
    await page.click('a[title="SIDUJA"]');

    // Esperar a que el formulario de login esté listo para ser completado
    await page.waitForSelector("#username");

    // Rellenar el formulario con el usuario y contraseña pasados
    await page.type("#username", usuario);
    await page.type("#password", clave);

    // Ejecutar el submit del formulario
    await page.click("#submit_button");

    // Esperar a que la página cargue después del login
    //await page.waitForSelector('#user-menu-toggle');
    await page.waitForTimeout(1250);

    // Obtenemos la URL actual después del login
    const loggedInURL = page.url();

    // Verificar si la URL después del login corresponde a la URL esperada para el inicio de sesión exitoso
    if (loggedInURL.includes("https://platea.ujaen.es/my/")) {
      // Navegar a la página de edición del usuario

      //? --- Obtener las cookies de sesión ---
      // const cookies = await page.cookies();

      // Mostrar las cookies por consola
      // console.log('Cookies de sesión:', cookies);
      //? --- Obtener las cookies de sesión ---

      await page.goto("https://platea.ujaen.es/user/edit.php");
      await page.waitForSelector('#id_firstname');

      // Leer valores de los campos de entrada
      const firstName = await page.$eval(
        "#id_firstname",
        (input) => input.value
      );
      const lastName = await page.$eval("#id_lastname", (input) => input.value);
      const email = await page.$eval("#id_email", (input) => input.value);

      // Obtener el src de la imagen con la clase userpicture
      const userPictureSrc = await page.$$eval(".userpicture", (images) => {
        const userPicture = images.find((img) => img.getAttribute("src"));
        return userPicture
          ? userPicture.getAttribute("src")
          : "https://static.vecteezy.com/system/resources/thumbnails/022/059/000/small/no-image-available-icon-vector.jpg";
      });

      await page.goto("https://platea.ujaen.es/user/profile.php?showallcourses=1");
      await page.waitForSelector(".card-body");

      // Obtener el texto de todos los elementos <a> dentro de los elementos <li> dentro del div
      const cursos = await page.evaluate(() => {
        const links = document.querySelectorAll(".card-body li.contentnode a");
        const linksArray = Array.from(links);
        return linksArray.map((link) => link.textContent.trim())
        .filter(text => text.includes('23/24'));
      });


      // Mostrar los valores por consola
      console.log("Valores obtenidos:");
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Email:", email);
      console.log("User Picture Src:", userPictureSrc);
      console.log("Cursos: ", cursos);

      // Crear un objeto sesión con los valores obtenidos
      const sesion = {
        firstName,
        lastName,
        email,
        userPictureSrc,
        cursos
      };

      // Cerrar el navegador
      await browser.close();

      // Enviar el objeto sesión como respuesta
      res.status(200).send(sesion);
    } else {
      // Cerrar el navegador
      await browser.close();
      // Enviar respuesta de inicio de sesión no exitoso (código 400 - Bad Request)
      console.log("Inicio de sesión fallido");
      res.status(400).send("Inicio de sesión fallido");
    }
  } catch (error) {
    console.error("Error durante el proceso de inicio de sesión:", error);
    res.status(500).send("Error durante el inicio de sesión");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
