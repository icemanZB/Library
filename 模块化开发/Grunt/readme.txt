1、先安装 nodejs 和 npm ( 包管理工具 )
2、npm install -g grunt-cli
3、npm install grunt --save-dev
4、grunt-version 查看版本号
5、合并 JavaScript 文件使用的插件是： contrib-concat
6、安装插件需要写配置文件 packgae.json
{
  "name": "webqq",  // 项目名称
  "version": "0.1.0", // 项目版本
  "devDependencies": {
    	"grunt" : "~0.4.2",  // grunt 版本
   		"grunt-contrib-concat" : "~0.3.0",  // 合并插件的版本
		"grunt-contrib-uglify" : "~0.3.2" // 压缩任务的版本
  }
}
7、cmd 进入webqq项目的目录(f: ->  cd webqq)
8、进入根目录后执行命令：npm install 运行即可，安装 devDependencies 下所有的插件，提交文件的时候就提交 package.json，获取到的人安装就好
9、此时项目中就会多出个文件夹叫 "node_modules"
10、写 Gruntfile.js 文件，里面的内容就是要执行的任务
module.exports = function(grunt) {

	grunt.initConfig({

		 pkg: grunt.file.readJSON('package.json'), // 关联配置文件

         // 合并js文件任务
		 concat : {
		     // webqq 任务名字(可以随便取)
			 webqq : {
			     // 合成所需要的 files js 文件
				 files : {
				     // 'dist/main.js' dist 合并所要放到哪个文件夹、main.js 合并后的文件名
					 'dist/main.js' : ['main.js','drag.js','scale.js','range.js']
				 }
			 }
		 },
		 // 压缩任务
		 uglify : {
			 webqq : {
				 files : {
					 'dist/main.min.js' : ['dist/main.js']
 				 }
			 }
		 }

	});

	grunt.loadNpmTasks('grunt-contrib-concat');  // 加载插件
	grunt.loadNpmTasks('grunt-contrib-uglify');

    // default 就是取个名字 在 cmd 的时候可以使用 grunt -aaa(就是取的名字)
  	grunt.registerTask('default', ['concat','uglify']); // 运行插件


};

11、cmd 在 webqq 跟目录下运行 grunt 即可

12、压缩插件 contrib-uglify 之后的流程和上面合并的插件一样

13、处理解决合并文件与 seajs 的冲突，上线的版本，比如合并操作：define() 要多出两个参数：第一个参数是当前模块的id、第二个参数是依赖模块的数组
// main 当前模块的地址(id)，drag scale range 都是依赖的js文件，可以省略后缀，这个是主文件名
define("main", [ "./drag", "./scale", "./range" ], function(require, exports, module) {
    require("./drag").drag(oDiv3);
});
// drag 当前模块的地址(id)
define("drag", [], function(require, exports, module) {

});

14、seajs 结合 Grunt 需要下载 grunt-cmd-transport ( id提取和依赖，可以避免手动修改 )、grunt-cmd-concat(文件合并)
先写 package.json 配置文件
{
  "name": "webqq",
  "version": "0.1.0",
  "devDependencies": {
    	"grunt" : "~0.4.2",
		"grunt-cmd-transport" : "~0.3.0",
   		"grunt-cmd-concat" : "~0.2.7",
		"grunt-contrib-uglify" : "~0.3.2"
  }
}
在进入webpp根目录，运行 npm install 下载相应的插件到本地

在写 Gruntfile.js 文件，执行相应的任务
module.exports = function(grunt) {

	grunt.initConfig({

		 pkg: grunt.file.readJSON('package.json'),
         // 提取依赖
		 transport : {
			 webqq : {
				 files : {
				     // 存到临时文件夹下，到时候可以删除( 可以使用插件contrib-clean )
					 '.build' : ['main.js','drag.js','scale.js','range.js']
				 }
			 }
		 },

		 concat : {
			 webqq : {
				 files : {
					 'dist/main.js' : ['.build/main.js','.build/drag.js','.build/scale.js','.build/range.js']
				 }
			 }
		 },
		 uglify : {
			 webqq : {
				 files : {
					 'dist/main.min.js' : ['dist/main.js']
 				 }
			 }
		 }

	});

	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

  	grunt.registerTask('default', ['transport','concat','uglify']);

};

最后运行 cmd grunt





