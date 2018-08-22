/**
 *
 * @param g
 */
const removeReference = (g) => {
    const overlaySelection = g.select('.overlay'),
        lineReferenceSelection = g.select('.line--reference');

    if (!overlaySelection.empty()) overlaySelection.remove();
    if (!lineReferenceSelection.empty()) lineReferenceSelection.empty();
};

export default removeReference;
