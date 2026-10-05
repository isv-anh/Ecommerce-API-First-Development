module.exports = (options) => ({
  ...options,
  resolve: {
    ...options.resolve,
    // Prisma emits .js imports in its generated TypeScript source.
    extensionAlias: { '.js': ['.ts', '.js'] },
  },
});
