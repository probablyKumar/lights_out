import React, { Component } from 'react';
import './Light.css';

class Light extends Component {
    static defaultProps = {
        numberOfLight: 25, // Default value for numberOfLight
        roundedCorners: [1, 5, 21, 25],
        lightsOn: [],
        beingHovered: [],
        errorClick: null,
    };

    handleClick = (key) => () => {
        this.props.returnClickedEvent(key);
    };

    handleHover = (key) => () => {
        if (key !== false) {
            this.props.returnHoveredEvent(key);
        } else {
            this.props.clearHover();
        }
    };

    render() {
        const { roundedCorners, numberOfLight, lightsOn, beingHovered, errorClick } = this.props;
        const totalIndex = Array.from({ length: numberOfLight }, (_, k) => k + 1);

        return (
            <div
                className="light-Container"
                style={{
                    gridTemplateColumns: `repeat(${Math.sqrt(numberOfLight)}, 1fr)`, // Dynamically set grid columns
                }}
            >
                {totalIndex.map((number) => (
                    <button
                        onClick={this.handleClick(number)}
                        onMouseEnter={this.handleHover(number)}
                        onMouseLeave={this.handleHover(false)}
                        className={`light-Main ${roundedCorners.includes(number) ? 'light-cornered-' + number : ''} 
                        ${lightsOn.includes(number) ? 'lights-On' : ''}
                        ${beingHovered.includes(number) ? 'being-Hovered' : ''}
                        ${errorClick === number ? 'error-Press' : ''}`}
                        key={number}
                    >
                        {null}
                    </button>
                ))}
            </div>
        );
    }
}

export default Light;
