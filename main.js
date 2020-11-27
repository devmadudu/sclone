// Modules to control application life and create native browser window


//for(let i = 0 ; i < 10000 ; i++) console.log("+¶4ÂÎ0RÀ­Ñ19JRh,í4+ÛþtUT';#¸¢:Ç1ýõ¦¬·wëÿ¿U]Iú\7Ú^o_·!¶A	úåB¹öqÖeuöÂñ\g½0ºÕ¦6á´Å)HpçúÛ/0ËÍwÚÐé<O~@ÆÓç®<s) gÒ2Èz§½²ÊF	­A©Õ÷££1yì\Ý ×ÇIyæ!Çd¯BIw&ðO§t~?¸=¤1ð¨NJº");


const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})