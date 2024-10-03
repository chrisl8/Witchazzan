import globals from 'globals';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      },
    },
    rules: {
      'no-unused-vars': ['warn'], // Make it only a warning so we can code.
      'no-prototype-builtins': 'off', // .hasOwnProperty() is FINE.
      // 'react/prop-types': 0,
      // 'jsx-a11y/no-static-element-interactions': 0,
      // 'jsx-a11y/click-events-have-key-events': 0,
      // 'jsx-a11y/label-has-for': 0,
      // 'class-methods-use-this': 0,
      // 'no-prototype-builtins': 'off',
      // 'react/destructuring-assignment': [1, 'never', {
      //   ignoreClassFields: false
      // }],
      // 'no-restricted-syntax': 'off',
      // 'react/no-access-state-in-setstate': 'off',
      // 'react/no-did-update-set-state': 'off',
      // 'react/jsx-props-no-spreading': 'off',
      // 'react/function-component-definition': [2, {
      //   namedComponents: 'arrow-function',
      //   unnamedComponents: 'arrow-function'
      // }]
    }
  }
];