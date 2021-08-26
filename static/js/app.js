
 // ======================
 // do the drop down. get the length of the array, the loop throufg adding each id to the option list.

d3.json("samples.json").then((data) => {

    var nameLength = data.names.length
    let idDropdown = document.getElementById('selDataset'); 

    for (var i = 0; i < nameLength; i++) {      
        let idOption = document.createElement('option');          
        idOption.text = data.names[i];      
        idOption.value = data.names[i];        
        idDropdown.add(idOption);      

    }
});


// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var enteredId = dropdownMenu.property("value");
  console.log(enteredId)

//  convert text value to a number

    var enteredIdnum = `${enteredId}` ;
    console.log(enteredIdnum);

    displayBarchart(enteredId);
    displayMetadata(940);
    displayBubblechart(enteredId);
}


// displayBarchart("940");
// displayMetadata(940);
// displayBubblechart("940");

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
}

function displayBubblechart (enteredId) {
    d3.json("samples.json").then((data) => {

        var sampleData = data.samples.filter(i => i.id === enteredId);
        //console.log(filterData);

        var filteredOtus = sampleData[0];
        //console.log(result);

        var otuIds = filteredOtus.otu_ids;
        //console.log(otuIdsSliced);

        var otuLables = filteredOtus.otu_labels;
        //console.log(otuLablesSliced);

        var sampleValues = filteredOtus.sample_values;
        //console.log(sampleValuesSliced);

        var traceBubble = {
            x: otuIds,
            y: sampleValues,
            text: otuLables,
            mode: "markers",
            marker: {
                type: "heatmap",
                size: sampleValues,
                color: otuIds
            },
        };

        var layoutBubble = {
            title: "All Bacteria Cultures Found",
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
            height: 600,
            width: 1200
        }

        var data = [traceBubble];

        Plotly.newPlot("bubble", data, layoutBubble);

    });

};


function displayBarchart(enteredId) {

    d3.json("samples.json").then((data) => {

        
        //console.log(data);
        //console.log(data.names.length);
        //console.log(data.names[1]);
        //console.log(data.metadata);
        //console.log(data.samples);

        //var ethnicity = data.metadata.map(({ ethnicity }) => ethnicity);


        //var id = data.samples.map(({ id }) => id);
        //var otu_ids = data.samples.map(({ otu_ids }) => otu_ids);

        //var ids = data.samples.map(s => s.otu_ids[0] );
        //var ids_sliced = ids.slice(0,10) ;

        //var values = data.samples.map(s => s.sample_values[0] );
        //console.log(values);
        //var values_sliced = values.slice(0,10) ;

        //console.log(ethnicity);
        //console.log(id[0]);
        //console.log(otu_ids[0]);
        //console.log(ids);
        //console.log(ids_sliced);
        //console.log(values_sliced);
        //console.log(values[0]);

        //var filtersamples = data.samples.filter(filterdata);
        //console.log(filtersamples);

        //var otu_ids

  

        // ==================================================================================
        var filterData = data.samples.filter(i => i.id === enteredId);
        //console.log(filterData);

        var result = filterData[0];
        //console.log(result);

        var otuIdsSliced = result.otu_ids.slice(0,10);
        console.log(otuIdsSliced);

        var otuLablesSliced = result.otu_labels.slice(0,10);
        //console.log(otuLablesSliced);

        var sampleValuesSliced = result.sample_values.slice(0,10);
        //console.log(sampleValuesSliced);

        var traceBar = {
            x: sampleValuesSliced.reverse(),
            y: otuIdsSliced.map( id => "OTU " + id).reverse(),
            text: otuLablesSliced.reverse(),
            type: "bar",
            orientation: "h"
        }

        var layoutBar = {
            title: "Top 10 Bacteria Cultures Found",
            height: 500
        }

        var data = [traceBar];


        Plotly.newPlot("bar", data, layoutBar);

    });

};