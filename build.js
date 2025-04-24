const electronInstaller = require("electron-winstaller");

(async () => {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: ".",
      outputDirectory: "./installer64",
      authors: "My App Inc.",
      exe: "myapp.exe",
    });

    console.log("It worked!");
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
})();
