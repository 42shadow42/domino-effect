import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-peer-deps-external';

export default {
	input: 'src/index.ts',
	treeshake: true,
	output: [
		{
			dir: 'lib/cjs',
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
			preserveModules: true,
		},
		{
			dir: 'lib/es',
			format: 'es',
			exports: 'named',
			sourcemap: true,
			preserveModules: true,
		}
	],
	plugins: [
		externals({
			includeDependencies: true
		}),
		typescript({
			useTsconfigDeclarationDir: true
		}),
		commonjs()
	]
};
