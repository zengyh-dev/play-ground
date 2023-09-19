import { useEffect } from "react";
import { getImg } from "./service";

const NetWork = () => {
    // 并发请求
    const concurrentRequest = (urlList: string[], maxNum: number) => {
        return new Promise((resolve) => {
            if (urlList.length === 0) {
                resolve([]);
                return;
            }
            const result: Response[] = [];

            let index = 0; // 下一个请求的下标
            let count = 0; // 当前请求完成数量

            async function request() {
                // 全部请求发出
                if (index >= urlList.length) {
                    return;
                }

                const curIndex = index; // 需要按顺序，所以要记录下标
                const url = urlList[index];

                index++;
                try {
                    const resp = await fetch(url);
                    result[curIndex] = resp;
                    resolve(result);
                } catch (error: any) {
                    result[curIndex] = error;
                    resolve(result);
                } finally {
                    count++;
                    // 全部请求都有结果
                    if (count === urlList.length) {
                        // 如果在 finally 块中使用了 return 语句
                        // 则该语句将会优先于 try 或 catch 块的 return 语句执行，
                        // 从而导致调用者收到 finally 块中返回的值,
                        // 并且不会执行之前的 try 或 catch 块的 return 语句
                        // eslint-disable-next-line no-unsafe-finally
                        return;
                    }
                    request();
                }
            }

            const times = Math.min(maxNum, urlList.length);

            // 并发请求
            for (let i = 0; i < times; i++) {
                request();
            }
        });
    };
    const urlList = [];
    for (let i = 1; i < 30; i++) {
        urlList.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
    }
    concurrentRequest(urlList, 5).then((resp) => {
        console.log(resp);
    });

    // 测试跨域
    const handleGetImg = async () => {
        const res = await getImg(
            "https://www.baidu.com/his?wd=&from=pc_web&rf=3&hisdata=&json=1&p=3&sid=26522_1437_21111_27113&req=2&csor=0&cb=jQuery110203974136340633463_1536993886011&_=1536993886012"
        );
        console.log("hhh", res);
    };

    useEffect(() => {
        handleGetImg();
    }, []);

    return <div>Test NetWork</div>;
};

export default NetWork;
