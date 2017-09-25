# sumJS

#### 数组元素洗牌
```js
let list = [1,2,3];
console.log(list.sort(function() {
  Math.random() - 0.5 }
)); // [2,1,3]
```

#### Map遍历
```js
let map = new Map();
map.set('aa', 1);
map.set('bb', 2);
for(let [key,val] of map){
  console.log(key + ' is ' + val);
}
```