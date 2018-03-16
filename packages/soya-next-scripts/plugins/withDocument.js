const { join } = require("path");

module.exports = (nextConfig = {}) =>
  Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (options.isServer) {
        const entry = config.entry;
        config.entry = () =>
          entry().then(entries => {
            const names = Object.keys(entries);
            const name = names.find(
              name => name === "bundles/pages/_document.js"
            );
            const [documentPageEntry] = entries[name];
            if (documentPageEntry !== "./pages/_document.js") {
              entries[name] = [
                `${require.resolve("../pages/_document")}?entry`
              ];
            }
            return entries;
          });

        const pagesDir = join(__dirname, "..", "pages");
        config.module.rules.push({
          test: /\.jsx?$/,
          include: pagesDir,
          exclude: str =>
            /node_modules/.test(str) && str.indexOf(pagesDir) !== 0,
          use: options.defaultLoaders.babel
        });
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
