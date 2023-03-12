import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import externals from 'rollup-plugin-peer-deps-external'
import terser from '@rollup/plugin-terser'

export default {
	input: 'src/index.ts',
	treeshake: true,
	output: [
		{
			dir: 'lib/cjs',
			format: 'cjs',
			exports: 'named',
			preserveModules: true,
		},
		{
			dir: 'lib/es',
			format: 'es',
			exports: 'named',
			preserveModules: true,
		},
	],
	plugins: [
		externals({
			includeDependencies: true,
		}),
		typescript({
			useTsconfigDeclarationDir: true,
		}),
		commonjs(),
		terser({
			mangle: {
				toplevel: true,
			},
			compress: {
				top_retain: ['src/index.ts'], 
				toplevel: true,
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
			},
		}),
	],
}
