//
// src
//

const html_src = ['full/**/*.html'] // html
const css_src = ['full/**/*.css'] // css
const sass_src = ['full/**/*.sass'] // sass
const js_src = ['full/**/*.js'] // js
const images_src = [
	'full/**/*.jpg',
	'full/**/*.svg',
	'full/**/*.png',
	'full/**/*.webp',
	'full/**/*.ico',
] // images

//
// подключение модулей
//

const { src, dest, series, watch } = require('gulp') // галп
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const html_min = require('gulp-htmlmin')
const auto_prefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const image_min = require('gulp-imagemin')
const ftp = require('vinyl-ftp')
const del = require('del')
const set_header = require('gulp-header')
const set_footer = require('gulp-footer')
const gulp_if = require('gulp-if')

//
// основное тело галпа
//

// очистка папки local
const del_local = () => {
	return del('mini/')
}

// html
const get_min_html = () => {
	return src(html_src)
		.pipe(concat('html_index.html'))
		.pipe(
			html_min({
				collapseWhitespace: true,
				removeComments: true,
				removeTagWhitespace: true,
				ignoreCustomFragments: [/<svg.*\/svg>/],
			})
		)
		.pipe(dest('mini/'))
}

// sass
const get_min_sass = () => {
	return src(sass_src)
		.pipe(concat('style.sass'))
		.pipe(
			sass({
				indentedSyntax: false,
			})
		)
		.pipe(
			auto_prefixer({
				overrideBrowserslist: 'last 2 versions',
			})
		)
		.pipe(concat('sass_style.css'))
		.pipe(
			sass({
				indentedSyntax: false,
			})
		)
		.pipe(csso())
		.pipe(dest('mini/'))
}

// css
const get_min_css = () => {
	return src(css_src)
		.pipe(concat('css_style.css'))
		.pipe(csso())
		.pipe(dest('mini/'))
}

// js
const get_min_js = () => {
	return src(js_src)
		.pipe(concat('js_script.js'))
		.pipe(uglify())
		.pipe(dest('mini/'))
}

// images
const get_min_images = () => {
	return src(images_src)
		.pipe(
			image_min([
				image_min.gifsicle({ interlaced: true }),
				image_min.mozjpeg({
					quality: 75,
					progressive: true,
				}),
				image_min.optipng({
					optimizationLevel: 5,
				}),
				image_min.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest('mini/'))
}

//
// to watch
//

const to_watch = () => {
	watch(html_src, series(get_min_html))
	watch(css_src, series(get_min_css))
	watch(sass_src, series(get_min_sass))
	watch(js_src, series(get_min_js))
	watch(images_src, series(get_min_images))
}

// выполнение всех программ и ватчинг
exports.default = series(
	del_local,
	get_min_html,
	get_min_sass,
	get_min_css,
	get_min_js,
	get_min_images,
	to_watch
)
