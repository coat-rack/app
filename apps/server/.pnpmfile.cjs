module.exports = {
  hooks: {
    readPackage: (pkg) => {
      console.log("Package depends on", pkg)
      return pkg
    }
  }
}
