module.exports = {
    extends: 'next/core-web-vitals',
    rules: {
      '@next/next/no-img-element': 'warn', // 降级为警告而不是错误
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
