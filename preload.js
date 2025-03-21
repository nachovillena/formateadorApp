const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    generarExcel: async (datos) => {
        return await ipcRenderer.invoke('generar-excel', datos);
    }
});