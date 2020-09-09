const { exec } = require("child_process");

console.log("Do not close this window, it is used to keep the backend server running, used for Discord's API and also it acts as a De-bug console.")

exec("electron ./main.js", (error, stdout, stderr) => {
  if (error) {
      console.log(`error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
  }
});

require("./bin.js");