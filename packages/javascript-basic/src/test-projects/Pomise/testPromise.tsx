import React from "react";






const App = () => {

    // const innerPromise = () => new Promise((innerResolve, innerReject) => {
    //     // 异步操作
    //     setTimeout(() => {
    //         innerReject({ test: 'hhh' });
    //     }, 1000);
    //     // throw new Error('Inner error');
    // });


    // const outerPromise = () => new Promise((resolve, reject) => {
    //     resolve('hhh');
    // });

    // outerPromise()
    //     .then(async () => {
    //         const results = [];
    //         for (const item of ['', '', '']) {
    //             const result = await innerPromise(); // 假设 innerPromise 是一个返回 Promise 的函数
    //             results.push(result);
    //         }
    //         return results;
    //     })
    //     .then((res) => {
    //         console.log('innerPromise res', res);
    //     })
    //     .catch((error) => {
    //         console.log('outerPromise', error);
    //     });

    window.addEventListener('unhandledrejection', (e) => {
        console.log('unhandledrejection', e);
    });

    const testPromise = async () => {
        try {
            throw new Error('setTimeout error');
        } catch (error) {
            console.log('test promise error');
            throw new Error('test promise error');
        }
    };

    const load = async () => {
        return await Promise.all([testPromise()]);
    };

    const testLoad = async () => {
        try {
            const res = await load();
            console.log('res', res);
        } catch (error) {
            console.log('testload error', error);
        }
    };

    testLoad();

    return <div>好</div>;
};

export default App;
