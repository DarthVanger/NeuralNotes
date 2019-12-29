module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect"
    },
    "import/resolver": {
      "webpack": {
      "config": "webpack.config.js"
      }
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "class-property"
  ],
  "rules": {
    "no-console": "off",
    "object-curly-spacing": ["error", "always"],
    "brace-style":  ["error", "1tbs", { "allowSingleLine": true }]
  }
};
