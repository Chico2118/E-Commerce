import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function Child({ data, onUpdate }) {
    useEffect(() => {
        console.log("Child: data updated to", data);
    }, [data]);

    return (
        <div>
            <h3>Child Component</h3>
            <p>Data: {data}</p>
            <button onClick={() => onUpdate(data + 1)}>
                Increment Data
            </button>
        </div>
    );
}

// Add PropTypes validation
Child.propTypes = {
    data: PropTypes.number.isRequired,        // data should be a required number
    onUpdate: PropTypes.func.isRequired       // onUpdate should be a required function
};

function Parent() {
    const [data, setData] = useState(0);

    // Function passed to Child to update the state in Parent
    const updateData = (newData) => {
        setData(newData);
    };

    return (
        <div>
            <h2>Parent Component</h2>
            <Child data={data} onUpdate={updateData} />
        </div>
    );
}

export default Parent;
