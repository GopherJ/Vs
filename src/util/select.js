const selectPaddingInnerOuterX = (width) => {
    let paddingInner, paddingOuter = 0.1;

    paddingInner = 0.2;

    if (width > 560) {
        paddingInner = 0.15;
    }

    if (width > 970) {
        paddingInner = 0.1;
    }

    return [paddingInner, paddingOuter];
};

const selectPaddingInnerOuterY = (height) => {
    let paddingInner, paddingOuter = 0.1;

    paddingInner = 0.2;

    if (height > 560) {
        paddingInner = 0.15;
    }

    if (height > 970) {
        paddingInner = 0.1;
    }

    return [paddingInner, paddingOuter];
};

const selectTicksNumY = (height) => {
    let ticksY = 1;

    if (height > 50) {
        ticksY = 2;
    }

    if (height > 100) {
        ticksY = 3;
    }

    if (height > 200) {
        ticksY = 5;
    }

    if (height > 400) {
        ticksY = 10;
    }

    return ticksY;
};

const selectTicksNumX = (width) => {
    let ticksX = 2;

    if (width >= 560) {
        ticksX = 5;
    }

    if (width > 960) {
        ticksX = 10;
    }

    return ticksX;
};

export {
    selectPaddingInnerOuterX,
    selectPaddingInnerOuterY,
    selectTicksNumX,
    selectTicksNumY
};
