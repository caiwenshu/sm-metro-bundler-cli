# sm-metro-bundler-cli
`sm-metro-bundler-cli` 自定义React Native打包，调整Id的引用为字符串,

基于React Native 0.50.3


[![npm version](https://badge.fury.io/js/sm-metro-bundler-cli.svg)](https://badge.fury.io/js/sm-metro-bundler-cli)


##来源

- 参考 https://github.com/tsyeyuanfeng/metro-bundler-cli
- 参考 https://github.com/tsyeyuanfeng/metro-bundler
- 参考 https://blog.csdn.net/yeputi1015/article/details/81476369

## FEATURE
- 增加id的引用使用字符串

## INSTALLATION

Install with npm globally:

```bash
npm install --global sm-metro-bundler-cli
```

or as a dependency for your project:

```bash
npm install --save sm-metro-bundler-cli
```

## USAGE
`sm-metro-bundler-cli` extends the officail bundle command line tool rather than change it, so you can bundle as usual with `metro-bundler-cli`.

```bash
sm-metro-bundler bundle  \
--entry-file index.js  \
--bundle-output dist/business.jsbundle  \
--assets-dest dist \
--platform ios  \
--dev false
```

`init` 用于创建整合公司架构的项目结构,模板来源私有库`sm-react-native-templates`,减少项目异构带来的问题

```bash
sm-metro-bundler init projectName
```


`upgrade` 升级当前项目的框架代码,同时会更新template.json文件,模板来源私有库`sm-react-native-templates`

```bash
sm-metro-bundler upgrade
```


`validate` 校验当前模板是否为最新版本,模板来源私有库`sm-react-native-templates`

```bash
sm-metro-bundler validate
```