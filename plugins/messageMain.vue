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
@import url(//at.alicdn.com/t/font_2038745_exod0i9cyhd.css);
.custom-message .success {
  background-color: #03cda9;
}
.custom-message .error {
  background-color: #d13131;
}
.custom-message .warn {
  background-color: rgb(255, 126, 14);
}
.custom-message .iconfont {
  font-size: 20px;
}
.custom-message .plugins-message-box {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 10px 20px;
  border-radius: 30px;
  color: #fff;
}
.custom-message .message-container {
  padding: 0 15px;
}
/* 动画进入开始时状态 */
.custom-message .taataa-enter {
  opacity: 0;
  transform: translate(-50%, -100%);
}
.custom-message .taataa-enter-to {
  transform: translate(-50%, 0%);
}
/* 动画进入过程动画效果 */
.custom-message .taataa-enter-active {
  transition: all 0.4s ease;
}
/* 动画离开开始时状态 */
.custom-message .taataa-leave {
  transform: translateY(0%);
}
/* 动画结束时动画 */
.custom-message .taataa-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
/* 动画离开过程动画效果 */
.custom-message .taataa-leave-active {
  transition: all 0.4s ease;
}
</style>