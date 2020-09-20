import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');
const banner = `/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;

const MINIFY = process.env.MINIFY;
const plugins = MINIFY ? [terser()] : [];
const extension = MINIFY ? '.min.js' : '.js';

export default {
  input: 'lib-esm/index.js',
  output: {
    name: pkg.name,
    globals: { '@uirouter/core': '@uirouter/core' },
    sourcemap: true,
    format: 'umd',
    exports: 'named',
    banner: banner,
    file: '_bundles/ui-router-dsr' + extension,
  },
  external: '@uirouter/core',
  plugins: plugins,
};
