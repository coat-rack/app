module.exports = {
  hooks: {
    // Replace all internal dependencies with the "workspace:*" version during actual installation
    // We need to keep actual versions in the package file to ensure that
    readPackage: (pkg) => {
      console.log("Replacing internal packages with workspace:* via coat-rack/.pnpmfile.cjs")
        
      for (const [name] of Object.entries(pkg.dependencies)){
        if (name.startsWith("@coat-rack/")) {
          pkg.dependencies[name] = 'workspace:*'
        }
      }
      
      for (const [name] of Object.entries(pkg.devDependencies)){
        if (name.startsWith("@coat-rack/")) {
          pkg.dependencies[name] = 'workspace:*'
        }
      }
     
      return pkg
    }
  }
}
