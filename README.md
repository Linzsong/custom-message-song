# vue插件发布到npm(消息弹窗插件)

## 一、Demo描述

本次演示的是一个使用 `vue` 发布自己的插件——`custom-message-song`这是一个简单消息弹窗插件（为下一个重量级插件“自定义表单”插件发布做练习准备），这次就来小试牛刀，从插件的开发到发布npm，我都踩了哪些坑[流泪]，让我们现在开始吧。

**开发环境版本：**

- `@vue/cli 4.5.14`
- `Vue2.x`  (`Vue3.x`的发布后期更新)



所有代码都可以在我的GitHub [custom-message-song](https://github.com/Linzsong/custom-message-song) 上查看,欢迎start...



话不多说，直接看效果：

![show demo](https://images.gitee.com/uploads/images/2020/0901/144445_2aba500b_5149688.gif "custom-message.gif")







## 二、插件使用

### 1、安装

```bash
npm i custom-message-song
```

### 2、使用

**在`main.js`中：**

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
// 引入差劲、样式
import customMessageSong from 'custom-message-song'
import 'custom-message-song/lib/custom-message-song.css'
// 使用插件
Vue.use(customMessageSong)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')

```

**参数：**

|  参数名  |   说明   |  类型  |       可选值       | 默认值  |
| :------: | :------: | :----: | :----------------: | :-----: |
|   type   | 弹窗类型 | String | success/warn/error | success |
| message  | 弹窗内容 | String |         —          |    —    |
| duration | 弹出时间 | Number |         —          |  2000   |

**例子：**

```js
// 例子
this.$message({
    type: "success",
    message: "操作成功",
    duration: 2000,
});
```



## 三、插件开发

### 1、创建项目

```basic
vue create custom-message-song
```

### 2、修改项目目录

- 将 ` src` 目录修改问 `example` ，用来做项目演示DEMO；
- 新增 `plugins` 目录，用来存放插件源码；
- 新增 `vue.config.js` 文件，新增代码如下：

```js
// vue.config.js
const path = require('path')
module.exports = {
  // 修改 pages 入口
  pages: {
    index: {
      entry: 'examples/main.js', // 入口，因为我们刚刚修改了src文件，它是原本的入口，因此这里要修改为example
      template: 'public/index.html', // 模板
      filename: 'index.html' // 输出文件
    }
  },
  // 扩展 webpack 配置
  chainWebpack: config => {
    // @ 默认指向 src 目录
    // 新增一个 ~ 指向 plugins
    config.resolve.alias
      .set('~', path.resolve('plugins'))

    // 把 plugins 加入编译，因为新增的文件默认是不被 webpack 处理的
    config.module
      .rule('js')
      .include.add(/plugins/).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  }
}
```

![目录图解](1%E3%80%81%E7%9B%AE%E5%BD%95%E5%9B%BE%E8%A7%A3.png)

### 3、插件源码开发

- 在`plugins`中新建`index.js` （在这里提供插件的install方法）文件 和 `messageMain.vue` 文件（插件文件的具体开发就不多说啦，相信大家都有这个实力）
- 我在`install` 方法中，仅使用了添加`Vue`实例的方法，通过把他们添加到 `Vue.prototype` 上，我们还可以添加：
  - 添加全局的方法、自定义组件`Vue.component` 或者`property`；
  - 添加全局资源：自定义指令、过滤器、过渡等；
  - 通过全局混入来添加一些组件选项；
  - 以上方法混合使用，效果更佳！

**index.js**

```js
import Vue from "vue"; // 引入Vue
import MessageMain from "./messageMain.vue"; // 引入上边定义好的message模板

function initMsg(props) {
  let duration = props.duration ? props.duration : 2000;
  const vm = new Vue({
    // h => createElement   返回虚拟DOM
    render: (h) => h(MessageMain, { props }),
  }).$mount();
  // 挂载到body上
  document.body.appendChild(vm.$el);

  const node = vm.$children[0];
  // 显示弹窗
  node.visible = true;

  // 定时器关闭弹窗
  setTimeout(() => {
    node.visible = false;
    setTimeout(() => {
      document.body.removeChild(vm.$el);
      vm.$destroy();
    }, 400);
  }, duration);

  return node;
}

export default {
  install(Vue) {
    Vue.prototype.$message = initMsg;
  },
};


```

**messageMain.vue** 

```vue

<template>
  <div class="custom-message">
    <transition name="taataa">
      <!-- 使用fade淡入淡出动画，使用type变量来控制class类名，达到更改type值就可以修改样式的效果 -->
      <div :class="['plugins-message-box', type]" v-if="visible">
        <!-- 使用iconClass来控制icon的类名，我使用的是阿里的字体图标库iconfont，可以根据个人爱好来更换 -->
        <div :class="['message-icon', 'iconfont', iconClass]"></div>
        <!-- 输出消息 -->
        <div class="message-container">{{ message }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
// 定义每一个type对应的class类名
const typeClass = {
  success: "icon-success",
  error: "icon-error",
  warn: "icon-warn",
};
export default {
  name: "messageMain",
  // 定义的是默认数据，默认值
  data() {
    return {
      visible: false, // 控制DOM显示隐藏
    };
  },
  props: {
    type: {
      type: String,
      default: "success",
    },
    icon: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 2000,
    },
  },
  computed: {
    // 如果外部传入icon则使用外部的icon，如果没有。则使用type值对应的icon
    iconClass() {
      if (this.icon) {
        return this.icon;
      } else {
        return typeClass[this.type];
      }
    },
  },
};
</script>
<style scoped>
 // 样式省略...
</style>

```

到这里插件就开发完啦，开发完后，我需要在本项目（example）中对其进行测试，本地能正常运行后，再发布都npm中。



## 四、插件打包

### 1、配置`packjson`

**修改`packjson.js` 如下：**

```json
{
  "name": "custom-message-song",
  "version": "0.1.13",			
  "private": false,
  "main": "./lib/custom-message-song.umd.min.js",
  "license": "MIT",
  "author": "linzisong",
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lib": "vue-cli-service build --target lib --name custom-message-song --dest lib plugins/index.js",
    "lint": "vue-cli-service lint"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Linzsong/custom-message-song"
  },
	...
    ...
    ...
}
```

**配置说明：**

|    字段    |                    描述                     |
| :--------: | :-----------------------------------------: |
|    name    |                  项目名称                   |
|  version   |                    版本                     |
|  private   | 是否私有化，这里要设置成false，否则无法发布 |
|  license   |                  开源协议                   |
|   author   |                  作者署名                   |
|    main    |       访问的插件的入口文件（打包后）        |
|    lib     |             npm 的一种打包方式              |
| repository |                 git仓库信息                 |

### 2、打包

```basic
npm run lib
```

打包后，目录如下：

![打包后目录](2.png)


## 五、发布npm

### 1、注册

npm 官网 ：https://www.npmjs.com/

### 2、登录

```basic
npm login
Username: 账号
Password: 密码
Email: (this IS public): 邮箱
Enter one-time password from your authenticator app: 邮箱验证
```

### 3、发布

```basic
npm publish
```

当你收到了npm给你发来贺电时，说明你已经发布成功啦！

最后，记得 `install` 一下自己发布的插件，检查一下是否有问题，至此，我们就成功发布了自己的插件。

## 六、注意事项

### 1、npm 路径源不正确

- npm登录时，需要切换镜像，我们经常会把npm的镜像切换成淘宝镜像，需要切换回来，不然没办法登录；

### 2、插件名和版本号

- 插件名成不能过于简单，也不能重复，否则会报错（`package.json` --> name）；
- 版本号每次发布的时候记得更新（`package.json` --> version）；

### 3、插件发布后样式丢失

​	这个问题困扰了我一段时间，在打包——>安装——>引用后，项目中可以使用，发现插件的js功能可以正常运行，而样式丢失，但在打包中的包中，是有样式文件的。我一遍又一遍的检查打包的问题，还是发现不了问题。原本我以为不需要引入样式，在`.umd.js` 文件中会帮我们引入，最后发现并没有。还是老老实实的引入样式。

```js
import 'custom-message-song/lib/custom-message-song.css'
```



