const testObj = {
    a: "ozo",
};

const testFunc = (obj: { a: string }) => {
    console.log("before change obj: ", obj); // ozo

    // 修改对象内的属性
    obj.a = "ulu";
    console.log("change propterty a, testObj: ", testObj); // ulu
    console.log("change propterty a, obj:", obj); // ulu

    // 直接重新赋值对象
    obj = { a: "boom" };
    console.log("deassign, testObj:", testObj);
    console.log("deassign, obj:", obj);
};

testFunc(testObj);

const PassByReference = () => {
    return <div>PassByReference</div>;
};

export default PassByReference;
