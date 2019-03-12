module.exports = {
  "plugins": [ "react" ],
  "env": {
   "browser": true,
    "node": true,
    "jasmine": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {    
    "no-console": 0,
    'no-unused-vars': ['error', { "args": "none" }]
  },
  "parser": "babel-eslint"
};

