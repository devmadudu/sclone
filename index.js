const { exec } = require("child_process");

console.log("Do not close this window, it is used to keep the backend server running, used for Discord's API and also it acts as a De-bug console.")

const { accessSync } = require("fs");
const path = require("path");

try {
    accessSync(path.join(__dirname, '..', 'node_modules', "electron")); //see if node_modules folder exists
} catch (e) {
  exec("npm i electron", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
  });
}

exec("npx electron ./main.js", (error, stdout, stderr) => {
  if (error) {
      console.log(`error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
  }
});

/*exec("node ./bin.js > console.log", (error, stdout, stderr) => {
  if (error) {
      console.log(`error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
  }
});*/

require("./bin.js");