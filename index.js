//Esta es la forma de incluír módulos con Node.js, en este caso el módulo 
//de Electron. Puedes consultar más sobre importación de módulos buscando 
//información sobre CommonJS en internet
const { app, BrowserWindow } = require('electron')

//Creamos una ventana, aquí puedes fijar el tamaño inicial.
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'icons/plane.ico'
  })
  //Desactivamos el menú por defecto de la ventana de windows.
  //win.setMenuBarVisibility(false)
  //El archivo que será cargado, vamos a crearlo en el siguiente paso.
  win.loadFile('index.html')
}

//Evento de inicio de la aplicación, una vez esté "Ready", crea la ventana.
app.whenReady().then(() => {
  createWindow()
})