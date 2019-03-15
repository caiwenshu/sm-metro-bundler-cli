# sm-metro-bundler-cli
`sm-metro-bundler-cli` 自定义React Native打包，调整Id的引用为字符串,

基于React Native 0.50.3

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
