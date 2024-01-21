import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import metablock from 'rollup-plugin-userscript-metablock';
import nodeResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' }
import meta from './meta.json' assert { type: 'json' }
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';
import { argv } from 'process';

fs.mkdir('dist/', { recursive: true }, () => null);

function plugins() {
    return [
        nodeResolve(),
        commonjs(),
        string({
            include: [
                'template/**',
            ],
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            ENVIRONMENT: JSON.stringify('production'),
            preventAssignment: true,
        }),
    ];
}

function* terserIfEnabled() {
    // if (argv.includes('--config-minify'))
    //     yield terser();
}
    
export default [{
    input: 'src/userscript.js',
    output: {
        file: `dist/${pkg.name}${pkg.version}.user.js`,
        format: 'iife',
        name: 'userscript',
        banner: () => `\n/*\n${ fs.readFileSync('./LICENSE', 'utf8') }*/`,
        sourcemap: true,
    },
    plugins: [
        ...plugins(),
        ...terserIfEnabled(),
        metablock({
            file: './meta.json',
            override: {
                name: meta.name,
                version: pkg.version,
                description: pkg.description,
                homepage: pkg.homepage,
                author: pkg.author,
            },
        }),
    ],
}];