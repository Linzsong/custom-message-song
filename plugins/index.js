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
