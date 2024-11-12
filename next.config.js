// next.config.js
module.exports = {
    webpack: (config) => {
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
        topLevelAwait: true,
      };
      return config;
    },
  };
  