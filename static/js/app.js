 // ==================================================================================================
 // do the drop down. get the length of the array, then loop through adding each id to the option list.
 // initialise charts with data from first id

d3.json("samples.json").then((data) => {

    // get the number of Ids  
    var nameLength = data.names.length

    // get the haddle of the drop down
    let idDropdown = document.getElementById("selDataset"); 

    // loop through the list of Ids and add each one to the dropdown list
    for (var i = 0; i < nameLength; i++) {      
        let idOption = document.createElement("option");          
        idOption.text = data.names[i];      
        idOption.value = data.names[i];        
        idDropdown.add(idOption);      
    }

    // initialise the page by displaying first id data
    var firstId = data.names[0];
    //console.log(firstId)

    // convert text value to a number
    var enteredIdnum = parseInt(firstId) ;

    displayBarchart(firstId);
    displayMetadata(enteredIdnum);  
    displayBubblechart(firstId);
    displayGaugechart (enteredIdnum);
});

// =====================================================================
// refresh page
function updatePlotly() {

    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var enteredId = dropdownMenu.property("value");
    //console.log(enteredId)

    // convert text value to a number
    var enteredIdnum = parseInt(enteredId);

    displayBarchart(enteredId);
    displayMetadata(enteredIdnum);   
    displayBubblechart(enteredId);
    displayGaugechart (enteredIdnum);
}

// =====================================================================
// Demographic information
function displayMetadata (enteredId) {

    d3.json("samples.json").then((data) => {
        var metaData = data.metadata.filter(i => i.id === enteredId);
        //console.log(filterMetadata);

        var filteredMetadata = metaData[0];
        //console.log(filteredMetadata); 

        var demographicPane = d3.select("#sample-metadata");

        // clear any exitsing data
        demographicPane.html("");
    
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicPane.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};


// =====================================================================
// Horizonetal Bar chart
function displayBarchart(enteredId) {

    d3.json("samples.json").then((data) => {

        var sampleData = data.samples.filter(i => i.id === enteredId);
        //console.log(filterData);

        var filteredOtus = sampleData[0];
        //console.log(filteredOtus);

        var otuIdsSliced = filteredOtus.otu_ids.slice(0,10);
        //console.log(otuIdsSliced);

        var otuLablesSliced = filteredOtus.otu_labels.slice(0,10);
        //console.log(otuLablesSliced);

        var sampleValuesSliced = filteredOtus.sample_values.slice(0,10);
        //console.log(sampleValuesSliced);

        // create a trace with horizonetal orientation
        var traceBar = {
            x: sampleValuesSliced.reverse(),
            y: otuIdsSliced.map( id => "OTU " + id).reverse(),
            text: otuLablesSliced.reverse(),
            type: "bar",
            orientation: "h"
        };

        var layoutBar = {
            title: "<b>Top 10 Bacteria Cultures Found</b>",
            height: 500
        };

        var data = [traceBar];

        // plot the bar chart
        Plotly.newPlot("bar", data, layoutBar);
    });

};

// =====================================================================
// Bubble chart with colour scaling
function displayBubblechart (enteredId) {
    d3.json("samples.json").then((data) => {

        var sampleData = data.samples.filter(i => i.id === enteredId);
        //console.log(filterData);

        var filteredOtus = sampleData[0];
        //console.log(filteredOtus);

        var otuIds = filteredOtus.otu_ids;
        //console.log(otuIds);

        var otuLables = filteredOtus.otu_labels;
        //console.log(otuLables);

        var sampleValues = filteredOtus.sample_values;
        //console.log(sampleValues);

        var traceBubble = {
            x: otuIds,
            y: sampleValues,
            text: otuLables,
            mode: "markers",
            marker: {
                type: "heatmap",
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
        };

        var layoutBubble = {
            title: "<b>Bacteria Cultures Per Sample</b>",
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
            height: 600,
            width: 1200
        };

        var data = [traceBubble];
        
        // plot the bubble chart
        Plotly.newPlot("bubble", data, layoutBubble);
    });
};



// =====================================================================
// Gauge chart with colour scaling
function displayGaugechart (enteredId) {

    d3.json("samples.json").then((data) => {
        var metaData = data.metadata.filter(i => i.id === enteredId);
        //console.log(filterMetadata);

        var filteredMetadata = metaData[0];
        //console.log(filteredMetadata); 

        var washFrequency = filteredMetadata.wfreq;
        //console.log(washFrequency);

        var traceGauge = {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFrequency,
                title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per week </br>" },
                type: "indicator",
                mode: "gauge",
                gauge: {
                    axis: { range: [0, 9], dtick: 1 },
                    steps: [
                      { range: [0, 1], color: "#BAF3FC" },
                      { range: [1, 2], color: "#A2DBE6" },
                      { range: [2, 3], color: "#86D1DE" },
                      { range: [3, 4], color: "#6AC6D7" },
                      { range: [4, 5], color: "#4DBBCF" },
                      { range: [5, 6], color: "#34AEC5" },
                      { range: [6, 7], color: "#2D95A8" },
                      { range: [7, 8], color: "#257C8C" },
                      { range: [8, 9], color: "#1E6370" }                                                                                                                                                
                    ],
                    threshold: {
                        line: { color: "purple", width: 5 },
                        thickness: 0.75,
                        value: washFrequency
                    }    
                }
        };
                
        var layoutGauge = { 
            width: 600, 
            height: 500,
            margin: { t: 0, b: 0 }
        };
        
        var data = [traceGauge];

        Plotly.newPlot("gauge", data, layoutGauge);

    });


};