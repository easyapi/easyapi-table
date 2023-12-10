import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    ingores: [
      '.vscode',
      '.output',
      'dist',
      'node_modules',
      'public',
    ],
  },
  {
    rules: {
      'brace-style': 'off',
      '@typescript-eslint/brace-style': 'off',
      'vue/comma-dangle': 'off',
      'vue/dot-location': 'off',
    },
  },
)
