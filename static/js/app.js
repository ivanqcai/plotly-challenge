// 1. Use the D3 library to read in samples.json.
var data = d3.json("samples.json");
// select dropdown menu
var dropdownMenu = d3.select("#selDataset");


function buildPlots(sample) {



    data.then((sampleData) => {
        console.log(sampleData);


        var samples = sampleData.samples;


        //Apply filter to reflect the sample data selection
        var filteredSample = samples.filter(sampleElement => sampleElement.id == sample);

        var otu_ids = filteredSample[0].otu_ids;
        console.log(otu_ids);
        var otu_labels = filteredSample[0].otu_labels;
        console.log (otu_labels);
        var sampleValues = filteredSample[0].sample_values;
        console.log(sampleValues);


//bar chart with a dropdown menu to display the top 10 OTU

        //use slice to find the top 10
        var otu_ids_10 = otu_ids.slice(0, 10).reverse();

        var otu_ids_10_f = otu_ids_10.map(d => "OTU-" + d + " ");
        console.log(`OTU-ids: ${otu_ids_10_f}`);
        //label
        var otu_labels_10 = otu_labels.slice(0,10);
        console.log(`OTU-labels: ${otu_labels_10}`);

        var sampleValues_10 = sampleValues.slice(0,10).reverse();
        console.log(sampleValues_10);

        // trace for bar chart
        var trace1 = {
            x: sampleValues_10,
            y: otu_ids_10_f,
            text: otu_labels_10,


            marker: {
                color: 'blue'},
                type:"bar",
                orientation: "h"
            };
        // create data variable
        var data1 = [trace1];
        // set layout for bar plot
        var layout1 = {
            title: "Top 10 OTU for each Sample ID: " +sample,
            yaxis:{
                tickmode:"linear",
            },

        };
        // bar plot using Plotly
        Plotly.newPlot("bar", data1, layout1);


//a bubble chart that displays each sample.

        //trace for bubble chart
        var trace2 = {
            x: otu_ids,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otu_ids
            },
            text: otu_labels
        };
        // layout for bubble plot
        var layout2 = {
            title: "Bacteria Cultures per Sample",
            xaxis:{title: "OTU ID: " + sample},
            hovermode: "closest",

        };
        // create data variable
        var data2 = [trace2];
        // bubble plot using Plotly
        Plotly.newPlot("bubble", data2, layout2);

    });
}


//demographic information.
function displayDemo(sample) {
    // read file
    data.then((data)=> {
        // get the metadata info
           var metadata = data.metadata;
           console.log(metadata)
        // filter meta data info by id
           var filteredMetaData = metadata.filter(meta => meta.id.toString() == sample);
           var filteredData = filteredMetaData[0];


        // select demographic panel to put data
           var panel = d3.select("#sample-metadata");
        // empty the demographic info panel each time before refreshing with new id information
           panel.html("");

// Display each key-value pair .
           Object.entries(filteredData).forEach(([key, value]) => {
                panel.append("h6").text(`${key.toUpperCase()}: ${value}`)
            });
        });
    }


// change plots when dropdown menu is changed
function optionChanged(sample) {
    buildPlots(sample);
    displayDemo(sample);
}


//dropdown mean change
function init() {
    // read data
    data.then((data)=> {
        console.log(data);
        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdownMenu.append("option")
                        .text(name)
                        .property("value");
        });
        // call to display
        buildPlots(data.names[0]);
        displayDemo(data.names[0]);
    });
}

init();

