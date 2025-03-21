//Esta es la forma de incluír módulos con Node.js, en este caso el módulo 
//de Electron. Puedes consultar más sobre importación de módulos buscando 
//información sobre CommonJS en internet
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

//Creamos una ventana, aquí puedes fijar el tamaño inicial.
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'icons/plane.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 📌 Cargar el Preload
      contextIsolation: true,  // Seguridad activada
      enableRemoteModule: false,
      nodeIntegration: false
  }
  })
  //Desactivamos el menú por defecto de la ventana de windows.
  win.setMenuBarVisibility(false)
  //El archivo que será cargado, vamos a crearlo en el siguiente paso.
  win.loadFile('index.html')
}

//Evento de inicio de la aplicación, una vez esté "Ready", crea la ventana.
app.whenReady().then(() => {
  createWindow()
});

ipcMain.handle('generar-excel', async (event, datos) => {
  try {
      // Abrir el diálogo para seleccionar la ubicación del archivo
      const { filePath } = await dialog.showSaveDialog({
          title: 'Guardar Excel',
          defaultPath: path.join(app.getPath('desktop'), 'reporte.xlsx'),
          filters: [{ name: 'Archivos Excel', extensions: ['xlsx'] }]
      });

      // Si el usuario cancela, no hacer nada
      if (!filePath) return { success: false, error: 'El usuario canceló la operación' };

      // Datos del Excel

      // Crear y guardar el archivo
      const libro = XLSX.utils.book_new();
      const hoja = XLSX.utils.aoa_to_sheet(datos);
      XLSX.utils.book_append_sheet(libro, hoja, "Hoja1");
      XLSX.writeFile(libro, filePath);

      return { success: true, filePath };
  } catch (error) {
      return { success: false, error: error.message };
  }
});