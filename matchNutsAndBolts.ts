function matchNutsAndBolts(nuts: string[], bolts: string[], compare: (nut: string, bolt: string) => number): [string, string][] {
    if (nuts.length !== bolts.length) {
        throw new Error("Nuts and bolts lists must be of the same length");
    }

    const matches: [string, string][] = [];

    function partitionAndMatch(nutsSubset: string[], boltsSubset: string[]) {
        if (nutsSubset.length === 0 || boltsSubset.length === 0) {
            return;
        }

        // Choose the first nut as the pivot to partition bolts
        const pivotNut = nutsSubset[0];
        let smallerBolts: string[] = [];
        let largerBolts: string[] = [];
        let matchingBolt: string | null = null;

        for (const bolt of boltsSubset) {
            const cmp = compare(pivotNut, bolt);
            if (cmp === -1) {
                largerBolts.push(bolt);
            } else if (cmp === 1) {
                smallerBolts.push(bolt);
            } else {
                matchingBolt = bolt;
            }
        }

        if (matchingBolt === null) {
            throw new Error("No matching bolt found for the pivot nut");
        }

        // Now use the matching bolt to partition the remaining nuts
        const smallerNuts: string[] = [];
        const largerNuts: string[] = [];
        for (const nut of nutsSubset.slice(1)) {
            const cmp = compare(nut, matchingBolt);
            if (cmp === -1) {
                smallerNuts.push(nut);
            } else if (cmp === 1) {
                largerNuts.push(nut);
            } else {
                throw new Error("Duplicate nut found");
            }
        }

        matches.push([pivotNut, matchingBolt]);

        // Recur for smaller and larger partitions
        partitionAndMatch(smallerNuts, smallerBolts);
        partitionAndMatch(largerNuts, largerBolts);
    }

    partitionAndMatch([...nuts], [...bolts]);
    return matches;
}

// Example usage:
const nuts = [
    "nut-9a4c3a3e",  // size 5
    "nut-c7e43f1d",  // size 2
    "nut-h6a2b1d",   // size 7
    "nut-f1b2d4c",   // size 1
    "nut-b1d4c2a",   // size 8
    "nut-a4c3a3e",   // size 4
    "nut-d4c2a1b",   // size 9
    "nut-e43f1d7",   // size 3
    "nut-4c3a3e9a",  // size 6
];

const bolts = [
    "bolt-6d2a7e90", // size 2
    "bolt-d2a1b4c",   // size 8
    "bolt-a1b4c2a",   // size 6
    "bolt-c3a3e9a4",  // size 5
    "bolt-e9a4c3a",   // size 7
    "bolt-f1d7h6a",   // size 9
    "bolt-1d7h6a2b",  // size 1
    "bolt-7h6a2b1d",  // size 3
    "bolt-2b1d4c",    // size 4
];

function compare(nut: string, bolt: string): number {
    const hiddenNutMap: { [key: string]: number } = {
        "nut-9a4c3a3e": 5,
        "nut-c7e43f1d": 2,
        "nut-h6a2b1d": 7,
        "nut-f1b2d4c": 1,
        "nut-b1d4c2a": 8,
        "nut-a4c3a3e": 4,
        "nut-d4c2a1b": 9,
        "nut-e43f1d7": 3,
        "nut-4c3a3e9a": 6,
    };

    const hiddenBoltMap: { [key: string]: number } = {
        "bolt-6d2a7e90": 2,
        "bolt-d2a1b4c": 8,
        "bolt-a1b4c2a": 6,
        "bolt-c3a3e9a4": 5,
        "bolt-e9a4c3a": 7,
        "bolt-f1d7h6a": 9,
        "bolt-1d7h6a2b": 1,
        "bolt-7h6a2b1d": 3,
        "bolt-2b1d4c": 4,
    };

    const nutIndex = hiddenNutMap[nut];
    const boltIndex = hiddenBoltMap[bolt];
    if (nutIndex < boltIndex) {
        return -1;
    }
    if (nutIndex === boltIndex) {
        return 0;
    }
    return 1;
}

const matches = matchNutsAndBolts(nuts, bolts, compare);
console.log(matches);

// Validation
function validateMatches(matches: [string, string][], nuts: string[], bolts: string[]) {
    if (matches.length !== nuts.length || matches.length !== bolts.length) {
        throw new Error(`Length mismatch: matches=${matches.length}, nuts=${nuts.length}, bolts=${bolts.length}`);
    }
    for (const [nut, bolt] of matches) {
        if (!nuts.includes(nut)) {
            throw new Error(`Nut ${nut} not in original nuts list`);
        }
        if (!bolts.includes(bolt)) {
            throw new Error(`Bolt ${bolt} not in original bolts list`);
        }
        if (compare(nut, bolt) !== 0) {
            throw new Error(`Mismatch: nut ${nut} does not match bolt ${bolt}`);
        }
    }
    console.log("All matches are valid!");
}

validateMatches(matches, nuts, bolts);
