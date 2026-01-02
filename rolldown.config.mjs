import { readFileSync } from 'fs';

const MINIFY = process.env.MINIFY;

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const banner = `/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;

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
    minify: !!MINIFY,
  },
  external: ['@uirouter/core'],
};

