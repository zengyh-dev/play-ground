import debounce from "./debounce";

const UtilTest = () => {
    const handleClick = () => {
        console.log("click btn");
    };

    return (
        <div>
            <h2>UtilTest</h2>
            <button onClick={debounce(handleClick, 500, true)}>test btn</button>
        </div>
    );
};

export default UtilTest;
