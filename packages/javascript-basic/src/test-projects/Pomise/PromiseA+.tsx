import React from "react";

// 函数可以使用type别名或者interface来定义
// type Resolve = (result: any) => void;
interface Resolve {
    (result: any): void;
}

interface Reject {
    (error: any): void;
}

interface PromiseCallback {
    (resolve: Resolve, reject: Reject): void;
}

interface OnFulfilledCallback {
    (result: any): void;
}

interface OnRejectdCallback {
    (error: any): void;
}

interface Callback {
    (...args: any[]): void;
}

interface IPromise {
    status: string;
    result: any;
    onFulfilledCallbacks: Callback[];
    onRejectedCallbacks: Callback[];
    resolve: Resolve;
    reject: Reject;
    then: any;
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2: MyPromise, x: any, resolve: Resolve, reject: Reject) {
    if (x === promise2) {
        throw new TypeError("Chaining cycle detected for promise");
    }

    if (x instanceof MyPromise) {
        /**
         * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
         *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
         */
        x.then((y) => {
            resolvePromise(promise2, y, resolve, reject);
        }, reject);
    } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
        // 2.3.3 如果 x 为对象或函数
        let then;
        try {
            // 2.3.3.1 把 x.then 赋值给 then
            then = x.then;
        } catch (e) {
            // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(e);
        }

        /**
         * 2.3.3.3
         * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
         * 传递两个回调函数作为参数，
         * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
         */
        if (typeof then === "function") {
            // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            let called = false; // 避免多次调用
            try {
                then.call(
                    x,
                    // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    (y: any) => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    (r: any) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                );
            } catch (e) {
                /**
                 * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
                 * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                 */
                if (called) return;
                called = true;

                /**
                 * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
                 */
                reject(e);
            }
        } else {
            // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
        return resolve(x);
    }
}

class MyPromise implements IPromise {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";

    // 初始化属性
    status: string = MyPromise.PENDING;
    // 初始化结果
    result: any = null;
    onFulfilledCallbacks: Callback[] = [];
    onRejectedCallbacks: Callback[] = [];

    constructor(func: PromiseCallback) {
        try {
            func(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);
        }
    }

    resolve = (result: any) => {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.FULFILLED;
            this.result = result;
            // resolve之后再执行所有的then里面的回调
            // 实现了多次调用，注意不是链式调用
            // 所有执行的callback获得的值都一样
            this.onFulfilledCallbacks.forEach((callback) => {
                callback(result);
            });
        }
    };

    reject = (error: any) => {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.REJECTED;
            this.result = error;
            this.onRejectedCallbacks.forEach((callback) => {
                callback(error);
            });
        }
    };

    // 我们显式使用obj.catch(onRejected)，内部实际调用的是obj.then(undefined, onRejected)
    then(onFulfilled: OnFulfilledCallback, onRejected?: OnRejectdCallback) {
        console.log("then 执行");
        // 规范 2.2.7.3 和 2.2.7.4 对 onFulfilled 和 onRejected 不是函数的情况做了更详细的描述，
        // 根据描述我们对 onFulfilled 和 onRejected 引入了新的参数校验，所以之前的参数校验就可以退役了
        // onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
        // onRejected =
        //     typeof onRejected === "function"
        //         ? onRejected
        //         : (reason) => {
        //               throw reason;
        //           };

        // 2.2.7规范 then 方法必须返回一个 promise 对象
        const promise2 = new MyPromise((resolve, reject) => {
            // pending状态，先保存两个回调
            if (this.status === MyPromise.PENDING) {
                // 这里的回调也要异步执行
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
                        try {
                            // 2.2.7.3 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
                            if (typeof onFulfilled !== "function") {
                                resolve(this.result);
                            } else {
                                const x = onFulfilled(this.result);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (error) {
                            // 2.2.7.2 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                            reject(error); // 捕获前面onFulfilled中抛出的异常
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
                        try {
                            if (typeof onRejected !== "function") {
                                reject(this.result);
                            } else {
                                const x = onRejected(this.result);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (error) {
                            reject(error); // 捕获前面onRejected中抛出的异常
                        }
                    });
                });
            } // Promise 只以 第一次为准，第一次成功就永久为fulfilled，第一次失败就永远状态为rejected
            else if (this.status === MyPromise.FULFILLED) {
                // 异步执行
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== "function") {
                            resolve(this.result);
                        } else {
                            const x = onFulfilled(this.result);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (error) {
                        // 2.2.7.2 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                        reject(error); // 捕获前面onFulfilled中抛出的异常
                    }
                });
            } //  一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法
            else if (this.status === MyPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== "function") {
                            reject(this.result);
                        } else {
                            const x = onRejected(this.result);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (error) {
                        reject(error); // 捕获前面onRejected中抛出的异常
                    }
                });
            }
        });

        return promise2;
    }
}

// 测试代码
console.log(1);
const promise1 = new MyPromise((resolve) => {
    console.log("函数参数里的this :", this);
    console.log("函数参数里的resolve :", resolve);
    // 这里我们都能找到resolve，但是调用resolve的时候，resolve里的this指向哪里了
    console.log(2);
    setTimeout(() => {
        console.log("A", promise1.status);
        resolve("这次一定");
        console.log("B", promise1.status);
        console.log(4);
    });
});

// 这里不是异步微任务，这里就是同步执行了类的函数
promise1
    .then(
        (result) => {
            console.log("C", promise1.status);
            console.log("fulfilled:", result);
            return "下次一定";
        },
        (reason) => {
            console.log("rejected:", reason);
        }
    )
    .then((res) => {
        console.log("then2:", res);
    });
console.log(3);

const App = () => {
    return <div>好</div>;
};

export default App;
