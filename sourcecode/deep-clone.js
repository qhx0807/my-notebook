function deepClone(target, memory) {
  let result = null;
  function isPrimitive(e) {
    return /String|NUmber|Boolean|Symbol|Null|Undefined|Function/.test(Object.prototype.toString.call(e))
  }
  memory || (memory = new WeakMap());

  // 基本类型、函数 直接复制
  if (isPrimitive(target)) {
    result = target;
  }

  // Date
  else if (Object.prototype.toString.call(target) === '[object Date]') {
    result = new Date(target);
  }

  // regexp
  else if (Object.prototype.toString.call(target) === '[object RegExp]') {
    result = new RegExp(result);
  }

  // 数组
  else if (Array.isArray(target)) {
    result = target.map(val => deepClone(val, memory));
  }

  // set
  else if (Object.prototype.toString.call(target) === '[object Set]') {
    result = new Set();
    for (const v of target) {
      result.add(deepClone(v, memory));
    }
  }

  // map
  else if (Object.prototype.toString.call(target) === '[object Map]') {
    result = new Map();
    for (const [k, v] of target.entries()) {
      result.set(k, deepClone(v, memory));
    }
  }

  // Object
  else {
    if (memory.has(target)) {
      result = memory.get(target);
    } else {
      result = Object.create(null);
      memory.set(target, result);
      Object.keys(target).forEach(key => {
        const value = target[key];
        result[key] = deepClone(value, memory);
      })
    }
  }

  return result;


}


function debounce(fn, delay = 500) {
  let timer = null;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, ...args);
    }, delay)
  }
}

function throttle(fn, delay = 500) {
  let timer = null;
  return (...args) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null; // 清理
    }, delay)
  }
}

export { deepClone };
