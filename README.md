# STATIC SOURCES
积累知识点，需要的时候好查找
***

## 目录
- [sumJS](#sumJS)
- [sumFun](sumFun)
- [sumCSS](sumCSS)
***

### sumJS

#### 数组元素洗牌
```javascript
let list = [1,2,3];
console.log(list.sort(function() {
  Math.random() - 0.5 }
)); // [2,1,3]
```

#### Map遍历
```javascript
let map = new Map();
map.set('aa', 1);
map.set('bb', 2);
for(let [key,val] of map){
  console.log(key + ' is ' + val);
}
```
***


### sumCSS

#### 垂直居中
```css
.center-vertical {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
```

#### 运算
```css
.container {
  background-position: calc(100% - 50px) calc(100% - 20px);
}
```
***


### sumFun

#### 将URL中的查询字符串转为参数对象
```javascript
getQueryStringArgs = (searchStr) => {
  searchStr = searchStr || location.search;
  let qs = (searchStr.length && searchStr.substring(1) || ''),
    args = {},
    items = qs.length ? qs.split("&") : [],
    item = null,
    name = null,
    value = null,
    i = 0,
    len = items.length;
  for (i=0; i < len; i++){
    item = items[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);
    name.length && args[name] = value;
  }
  return args;
};
```