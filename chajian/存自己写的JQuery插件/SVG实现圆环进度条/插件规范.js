/*插件规范
1.NEW 一次 可以初始化一个页面的多个SVG 他们的样式名是一个
2.默认的样式表里  是在不传参的默认样子
3.如果一个页面两个SVG被初始化，并且都不是初始化的样子，那么就去读取标签里的data配置项 用$(this)修改当前内部的同名样式的 style

1两个圆环的 宽度 颜色  是否圆角  透明度
2文字位置（坐上 居中 右下）  大小  颜色
3 是否有滑块表单 表单长度等宽 SVG
4 是否有数字表单*/