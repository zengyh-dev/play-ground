const myMap = new Map();

console.log("map prototype", Object.getPrototypeOf(myMap));

const myObj = {};

console.log("obj prototype", Object.getPrototypeOf(myObj));

function replacer(key: any, value: any) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function reviver(key: any, value: any) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
}

const originalValue = new Map([["a", 1]]);
const str = JSON.stringify(originalValue, replacer);
console.log(str);
const newValue = JSON.parse(str, reviver);
console.log(originalValue, newValue);

const TestMap = () => {
    return <div>Test_Map</div>;
};

export default TestMap;
