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

class MyPromise {
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
        this.status = MyPromise.PENDING;
        this.result = null;
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }
    resolve(result: any) {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.FULFILLED;
            this.result = result;
            this.onFulfilledCallbacks.forEach((callback) => {
                callback(result);
            });
        }
    }
    reject(reason: any) {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.REJECTED;
            this.result = reason;
            this.onRejectedCallbacks.forEach((callback) => {
                callback(reason);
            });
        }
    }
    then(onFulfilled: OnFulfilledCallback, onRejected?: OnRejectdCallback) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
        const onRejectedFix =
            typeof onRejected === "function"
                ? onRejected
                : (reason: any) => {
                      throw reason;
                  };
        if (this.status === MyPromise.PENDING) {
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    onFulfilled(this.result);
                });
            });
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    onRejectedFix(this.result);
                });
            });
        }
        if (this.status === MyPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.result);
            });
        }
        if (this.status === MyPromise.REJECTED) {
            setTimeout(() => {
                onRejectedFix(this.result);
            });
        }
        console.log("then里的this:", this);
        return this;
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

const PromiseMini = () => {
    return <div>好</div>;
};

export default PromiseMini;
