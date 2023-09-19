// window.addEventListener("unhandledrejection", function (event) {
//     // 这个事件对象有两个特殊的属性：
//     console.log(event.promise); // [object Promise] —— 生成该全局 error 的 promise
//     console.log(event.reason); // Error: Whoops! —— 未处理的 error 对象
// });
// com;
// throw new Error("Whoops!");
new Promise(function () {
    throw new Error("Whoops!");
}); // 没有用来处理 error 的 catch

new Promise(function () {
    console.log("dhhh");
});

console.log("asdfh");

const ErrorHandle = () => {
    return <div>Test Await</div>;
};

export default ErrorHandle;
