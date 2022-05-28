module.exports = api => {
  api.cache(true);

  const presets = [
    [
      "@babel/env",
      {
        modules: false,
        loose: true,
        exclude: [
          "transform-typeof-symbol"
        ]
      }
    ]
  ];

  const plugins = [
    "transform-es2015-modules-strip"
  ];

  return {
    presets,
    plugins,
  };
}
