import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: 'src/index.js',
});

const outputs = [config.es()];

if (process.env.BUILD === 'production') {
  outputs.push(
    config.cjs({
      // output: {
      //   exports: 'named',
      // },
    }),
  );
  outputs.push(
    config.umd({
      output: {
        globals: {
          angular: 'angular',
        },
        // exports: 'named',
      },
    }),
  );
}

export default outputs;
