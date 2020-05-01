const Promise = require('bluebird')
const _ = require('lodash')
const mkdirp = require('mkdirp')
const gphoto2 = require('gphoto2');
const GPhoto = Promise.promisifyAll(new gphoto2.GPhoto2());
const fs = Promise.promisifyAll(require('fs'));
const express = require('express')
const app = express()
const port = 80
const outputFolder = `${__dirname}/../output/`

app.get('/', (req, res) => res.send('Hello World!'))

const setupCamera = async (app, camera, endpointID) => {
  console.log(camera)
  const settings = await camera.getConfigAsync()
  const outputPath = `${outputFolder}/1`

  app.get(`/download${endpointID}`, (req, res) => {
    const file = `${outputPath}/picture.jpg`;
    res.download(file);
  });

  app.get(`/picture${endpointID}`, async (req, res) => {
    const data = await camera.takePictureAsync({download: true})

    await fs.writeFileASync(`${outputPath}/picture.jpg`, data);
    res.send(200)
  });

  app.get(`/settings${endpointID}`, async (req, res) => {
    res.json(settings);
  });

  return mkdirp(outputPath)
}

const setupDefaultCamera = (app, camera) => {
  return setupCamera(app, camera, '')
}

app.listen(port, () => {
  console.log(`balena-dslr-server listening on http://localhost:${port}`)
  // List cameras / assign list item to variable to use below options
  GPhoto.list(async (cameras) => {
    if (cameras.length === 0) {
      console.log('No cameras found')
      process.exit(1)
    }
    await Promise.each(_.map(cameras, (camera) => {
      return setupDefaultCamera(app, Promise.promisifyAll(camera))
    }))
  })
})

// Negative value or undefined will disable logging, levels 0-4 enable it.
GPhoto.setLogLevel(1);
GPhoto.on('log', (level, domain, message) => {
  console.log(domain, message);
});
