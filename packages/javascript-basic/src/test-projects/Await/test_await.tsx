const firstStep = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            console.log("fisrt step");
            resolve("fisrt step");
        }, 5000);
    });

const secondStep = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                console.log("second step");
                throw Error("second step");
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });

const handleSteps = async () => {
    try {
        const value1 = await firstStep();
        const value2 = await secondStep();
        console.log(value1);
        console.log(value2);
        // await value1;
        // await value2;
    } catch (error) {
        console.log("error!!", error);
    }
};
handleSteps();

const TestAwait = () => {
    return <div>Test Await</div>;
};

export default TestAwait;
