const debounce = (func: () => void, delay: number, immediate = false): Function => {
    let timer: number | null = null; // 借助闭包保存计时器

    const clearTimer = () => {
        if (timer) {
            clearTimeout(timer);
        }
    };

    return (...args: any) => {
        // 进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件
        // 所以要取消当前的计时，重新开始计时
        clearTimer();

        // 首次进入触发
        if (immediate) {
            // 如果当前timer是null,那就可以执行
            const shouldExecute = !timer;

            // 然后设置一个新timer
            // 超过一个时间再记为null，才让执行
            timer = setTimeout(() => {
                timer = null;
            }, delay);

            if (shouldExecute) {
                func.apply(this, args);
            }
        } else {
            timer = setTimeout(() => {
                // this指向了事件触发的那个元素
                clearTimer();
                func.apply(this, args);
            }, delay);
        }
    };
};
export default debounce;
// tester
