const { spawn } = require("child_process");
var express = require('express');
var router = express.Router();

router.get('/data', (req, res, next) =>
{
  const ls = spawn("E:\\VoxelGridSample\\Algorithms.exe", ["E:\\Sample2.js"]);

  ls.stdout.on("data", data => {
      //console.log(`stdout: ${data}`);
      res.write(data);
  });

  ls.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });

  ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
      res.end();
  });

});

module.exports = router;
