class Share {
    constructor() {
        this.getShareImg();
    }
    getShareImg = () => {
        return new Promise(() => {
            const downloadImage = () => {
                console.log(this);
            };
            downloadImage();
        });
    };
}

const share = new Share();
console.log(share);

const TestThis = () => {
    return <div>Test This</div>;
};

export default TestThis;
