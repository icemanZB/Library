module.exports = function (grunt) {

	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),
		/**
		 * step 1:
		 * 将入口文件拷贝到 产出目录
		 */
		copy: {
			hellosea: {
				files: {
					"js/hellosea/dist/a.js": ["js/hellosea/src/a.js"]
				}

			}
		},

		/**
		 * step 2:
		 * 创建一个临时目录
		 * 将需要合并的js文件转为具名函数，并保持独立地保存在这个临时目录
		 */
		transport: {

			hellosea: {
				options: {
					// 是否采用相对地址
					relative: true
					// 生成具名函数的id的格式 默认值为 {{family}}/{{name}}/{{version}}/{{filename}}
					// format: '../js/hellosea/{{filename}}'
				},
				files  : [{
					// 相对路径地址
					expand: true,
					'cwd' : 'js/hellosea/',
					// 需要生成具名函数的文件集合
					'src' : ['dist/a.js', 'src/util.js'],
					// 生成存放的文件目录。里面的目录结构与 src 里各个文件名带有的目录结构保持一致
					'dest': '.build'
				}]
			}
		},

		/**
		 * step 3:
		 * 将临时目录下独立的具名函数文件 合并为 1个 js 文件
		 * 将这个合并的 js 文件 拷贝到 我们的输出目录
		 */
		concat: {
			hellosea: {
				options:{
					include: 'relative'
				},
				files: {
					// src: ['.build/dist/hellosea.js','.build/src/util.js'],
					// dest: 'js/hellosea/dist/hellosea.js',
					'js/hellosea/dist/a.js':['.build/dist/a.js','.build/src/util.js']
					// '.build/a.js' : ['.build/a.js','.build/b.js']
				}
			}
		},

		/**
		 * step 4:
		 * 压缩 这个 合并后的 文件
		 */
		uglify: {
			hellosea: {
				files: {
					'js/hellosea/dist/hellosea.js': ['js/hellosea/dist/hellosea.js'] //对dist/application.js进行压缩，之后存入dist/application.js文件
				}
			}
		},

		/**
		 * step 5:
		 * 将这个临时目录删除
		 */
		clean: {
			build: ['.build']
		}
	});

	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['copy', 'transport', 'concat', 'uglify', 'clean']);

	grunt.registerTask('build', function (name, step) {
		switch (step) {
			case "1":
				grunt.task.run('copy:' + name);
				break;

			case "2":
				grunt.task.run('transport:' + name);
				break;
			case "3":
				grunt.task.run('concat:' + name);
				break;
			case "4":
				grunt.task.run('uglify:' + name);
				break;
			case "5":
				grunt.task.run('clean:' + name);
				break;

			default:
				grunt.task.run(['copy:' + name, 'transport:' + name, 'concat:' + name, 'uglify:' + name, 'clean'])
				break;
		}
	});
};