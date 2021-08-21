function rankArray(array) {
    console.log(array);
    let sorted_array = Array.from(array);
    sorted_array.sort(function (a, b) {
        return b - a;
    });

    console.log(sorted_array);

    let indices = Array();

    for (let element of array) {
        indices.push(sorted_array.indexOf(element));
    }

    console.log(indices);

    let indicesOfIndices = Array();

    for (let i = 0; i < array.length; i++) {
        let searchFrom = 0;
        console.log("searching", i);
        while (true) {
            let index = indices.slice(searchFrom).indexOf(i);
            if (index == -1) break;
            searchFrom += index;
            console.log("index", searchFrom);
            indicesOfIndices.push(searchFrom);
            searchFrom++;
        }
    }

    console.log(indicesOfIndices);
    return indicesOfIndices;
}

array = [210, 198, 201, 178, 186, 201];
ranks = rankArray(array);

let i = 0;
let backRank = 0;
let lastElement = 0;
for (rank of ranks) {
    if (lastElement == array[rank]) {
        backRank++;
    } else {
        backRank = 0;
    }
    console.log(i - backRank, array[rank]);
    lastElement = array[rank];
    i++;
}
