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

// interface IPromise {
//     status: string;
//     result: any;
//     onFulfilledCallbacks: Callback[];
//     onRejectedCallbacks: Callback[];
//     resolve: Resolve;
//     reject: Reject;
//     then: any;
// }
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
        console.log("hhh");
    } else {
        // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
        return resolve(x);
    }
}

class MyPromise {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";

    status: string = MyPromise.PENDING;
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
            this.onFulfilledCallbacks.forEach((callback) => {
                callback(result);
            });
        }
    };

    reject = (error: any) => {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.FULFILLED;
            this.result = error;
            this.onRejectedCallbacks.forEach((callback) => {
                callback(error);
            });
        }
    };

    then = (onFulfilled: OnFulfilledCallback, onRejected?: OnRejectdCallback) => {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (error) => {
                      throw error;
                  };

        const promise2 = new MyPromise((resolve, reject) => {
            if (this.status == MyPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== "function") {
                                resolve(this.result);
                            } else {
                                const x = onFulfilled(this.result);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        onRejected?.(this.result);
                    });
                });
            } else if (this.status === MyPromise.FULFILLED) {
                setTimeout(() => {
                    onFulfilled(this.result);
                });
            } else if (this.status === MyPromise.REJECTED) {
                setTimeout(() => {
                    onRejected?.(this.result);
                });
            }
        });
        return promise2;
    };
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
        return "没有下次";
    });
console.log(3);

const Promise_diy = () => {
    return <div>好</div>;
};

export default Promise_diy;
