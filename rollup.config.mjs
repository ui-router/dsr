import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const MINIFY = process.env.MINIFY;

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const banner = `/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;

const terserOpts = {
  output: {
    // retain multiline comment with @license
    comments: (node, comment) => comment.type === 'comment2' && /@license/i.test(comment.value),
  },
};

const plugins = [nodeResolve()];

if (MINIFY) plugins.push(terser(terserOpts));

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
  external: ['@uirouter/core'],
  plugins: plugins,
};
