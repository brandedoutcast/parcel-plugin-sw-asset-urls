const fs = require("fs"), path = require("path"), url = require("url")

const urlJoin = (first, second) => {
  let firstWithSlash = first.endsWith("/") ? first : `${first}/`
  return url.resolve(firstWithSlash, second)
}

module.exports = bundler => {
  const fileMap = {},
    serviceWorkerNames = ["service-worker.js", "serviceWorker.js", "sw.js"]

  let publicURL = "./"

  const processBundle = (bundle) => {
    let bundledFilename = urlJoin(publicURL, path.basename(bundle.name))

    if (serviceWorkerNames.some(name => bundledFilename.endsWith(name))) {
      return
    }

    const actualFilename = bundle.entryAsset ? bundle.entryAsset.relativeName : bundle.assets.size ? bundle.assets.values().next().value.relativeName : null
    if (actualFilename && !fileMap[actualFilename]) {
      fileMap[actualFilename] = bundledFilename
    }

    bundle.childBundles.forEach(bundle => processBundle(bundle))
  }

  bundler.on("bundled", bundle => {
    publicURL = bundler.options.publicURL

    bundler.options.entryFiles.length > 1
      ? bundle.childBundles.forEach(processBundle)
      : processBundle(bundle)

    let swDistFilepath = null

    serviceWorkerNames.forEach(name => {
      let swFilepath = path.join(bundler.options.outDir, name)
      if (fs.existsSync(swFilepath)) {
        swDistFilepath = swFilepath
      }
    })

    let swContent = fs.readFileSync(swDistFilepath, "utf8")
    for (const key in fileMap) {
      if (fileMap.hasOwnProperty(key)) {
        swContent = swContent.replace(key, fileMap[key].replace(/\\/, ""))
      }
    }
    fs.writeFileSync(swDistFilepath, swContent)
  })
}