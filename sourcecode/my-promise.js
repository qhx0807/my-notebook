const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(func) {
    this.PromiseState = PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallBacks = [];
    this.onRejectedCallBacks = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(result) {
    if (this.PromiseState === PENDING) {
      setTimeout(() => {
        this.PromiseState = FULFILLED;
        this.PromiseResult = result;
        this.onFulfilledCallBacks.forEach((cb) => {
          cb(result);
        });
      });
    }
  }

  reject(reason) {
    if (this.PromiseState === PENDING) {
      setTimeout(() => {
        this.PromiseState = REJECTED;
        this.PromiseResult = reason;
        this.onRejectedCallBacks.forEach((cb) => {
          cb(reason);
        });
      });
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (r) => {
            throw new Error(r);
          };
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.PromiseState === PENDING) {
        this.onFulfilledCallBacks.push(() => {
          try {
            let x = onFulfilled(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallBacks.push(() => {
          try {
            let x = onRejected(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.PromiseState === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
            // onFulfilled(this.PromiseResult);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.PromiseState === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
            // onRejected(this.PromiseResult);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
    return promise2;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(cb) {
    return this.then(cb, cb);
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    } else if (value instanceof Object && "then" in value) {
      return new MyPromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    } else {
      return new MyPromise((resolve) => {
        resolve(value);
      });
    }
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      // 判断参数
      if (Array.isArray(promises)) {
        let result = [];
        let count = 0;

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((item, index) => {
          MyPromise.resolve(item).then(
            (value) => {
              count++;
              result[index] = value;
              // 完成所有promises
              (count === promises.length) && resolve(result);
            },
            (reason) => {
              // promises 中有一个失败（rejected）
              // Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
              reject(reason);
            }
          );
        })
      } else {
        return reject(new TypeError('arguments is not iterable'))
      }
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      // 判断参数
      if (Array.isArray(promises)) {
        let result = [];
        let count = 0;

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((item, index) => {
          MyPromise.resolve(item).then(
            (value) => {
              count++;
              result[index] = {
                status: "fulfilled",
                value: value,
              };
              // 完成所有promises
              (count === promises.length) && resolve(result);
            },
            (reason) => {
              count++;
              result[index] = {
                status: 'rejected',
                reason: reason,
              };
              (count === promises.length) && resolve(result);
            }
          );
        });
      } else {
        return reject(new TypeError('arguments is not iterable'))
      }
    });
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        let errors = [];
        let count = 0;

        if (promises.length === 0) {
          return reject(new AggregateError('No Promise in Promise.any was resolved'))
        }

        promises.forEach((item) => {
          MyPromise.resolve(item).then(
            (value) => {
              // 只要其中的一个 promise 成功，就返回那个已经成功的 promise.
              resolve(value);
            },
            (reason) => {
              count++;
              errors.push(reason);
              count === promises.length && reject(new AggregateError(reason));
            }
          );
        });
      } else {
        return reject(new TypeError("arguments is not iterable"));
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        if (promises.length > 0) {
          promises.forEach((item) => {
            // 最先完成的那一个 promise
            MyPromise.resolve(item).then(resolve, reject);
          });
        }
      } else {
        return reject(new TypeError("arguments is not iterable"))
      }
    });
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 *
 * @param {promise}   promise2 promise1.then方法返回的新的promise对象
 * @param {*} x       promise1中onFulfilled或onRejected的返回值
 * @param {*} resolve promise2的resolve方法
 * @param {*} reject  promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    // 如果循环引用 就报错
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  if (x instanceof MyPromise) {
    if (x.PromiseState === PENDING) {
      x.then((y) => {
        resolvePromise(promise2, y, resolve, reject);
      }, reject);
    } else if (x.PromiseState === FULFILLED) {
      resolve(x.PromiseResult);
    } else if (x.PromiseState === REJECTED) {
      reject(x.PromiseResult);
    }
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
  }
}

export default MyPromise;
