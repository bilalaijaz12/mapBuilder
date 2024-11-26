// Utility functions to extract numbers from descriptions
const extractNumbers = (description) => {
    if (!description) return null;
    // Find all numbers (including decimals) in the description
    const numbers = description.match(/\d+(\.\d+)?/g);
    return numbers ? numbers.map(Number) : null;
};

// Get the smallest or largest number from description based on condition
const getNumberFromCondition = (description, numbers) => {
    if (!description || !numbers) return null;
    
    if (description.includes('whichever is less')) {
        return Math.min(...numbers);
    }
    if (description.includes('whichever is greater')) {
        return Math.max(...numbers);
    }
    // If no condition, return first number or null
    return numbers[0] || null;
};

const calculateBuildableArea = (parcel) => {
    // const lotData = parcel.assessment.lot;
    const zoningData = parcel.zoning;
    
    // Get basic lot dimensions
    const lotSize = parcel.derived.calculatedLotArea;
    console.log('Lot Size:', lotSize);
    
    // Get FAR (this is always a direct number)
    const far = parseFloat(zoningData.densityFloorArea.value);
    
    // Extract setbacks
    const frontSetback = getNumberFromCondition(
        zoningData.frontSetback.description,
        extractNumbers(zoningData.frontSetback.description)
    ) || 0;

    const rearSetback = getNumberFromCondition(
        zoningData.rearSetback.description,
        extractNumbers(zoningData.rearSetback.description)
    ) || 0;

    const sideSetback = getNumberFromCondition(
        zoningData.sideSetback.description,
        extractNumbers(zoningData.sideSetback.description)
    ) || 0;

    // Get maximum height
    const heightNumbers = extractNumbers(zoningData.maximumBuildingHeight.description);
    const maxHeight = heightNumbers ? Math.min(...heightNumbers) : 0;

    // Calculate buildable area
    const buildableArea = {
        lotSize,
        setbacks: {
            front: frontSetback,
            rear: rearSetback,
            side: sideSetback
        },
        maxHeight,
        far,
        // Calculate maximum buildable footprint (rough estimation)
        buildableFootprint: lotSize - (
            // Subtract setback areas
            (frontSetback + rearSetback) * Math.sqrt(lotSize) +
            (2 * sideSetback) * Math.sqrt(lotSize)
        ),
    };

    // Calculate total possible buildable area using FAR
    buildableArea.maxBuildableArea = lotSize * far;

    // Add raw descriptions for reference
    buildableArea.descriptions = {
        frontSetback: zoningData.frontSetback.description,
        rearSetback: zoningData.rearSetback.description,
        sideSetback: zoningData.sideSetback.description,
        height: zoningData.maximumBuildingHeight.description
    };

    return buildableArea;
};

export default calculateBuildableArea;