
file = "samples.json"

// Global values
var All_Names;
var All_Metadata;
var All_Samples;

var sampleInputElement = d3.select("#selDataset");

initialize();



function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}



function initialize() {

    console.log("Entering initialize()");

    d3.json(file).then(function(data) {
  
        // Grab values from the data json object to build the plots
        All_Names = data.names;
        All_Metadata = data.metadata;
        All_Samples = data.samples;
        // var name = data.dataset.name;
        // var stock = data.dataset.dataset_code;
        // var startDate = data.dataset.start_date;
        // var endDate = data.dataset.end_date;
        // var dates = unpack(data.dataset.data, 0);
        // var closingPrices = unpack(data.dataset.data, 4);

        console.log("Names ", All_Names);
        console.log("Metadata ", All_Metadata);
        console.log("Samples ", All_Samples);

        // console.log("Testing 123 ", unpack(metadata, 1));
        console.log("Testing 123 ", All_Metadata[3].id);
        console.log("Testing 123 ", All_Metadata[3].age);
        console.log("Testing 123 ", All_Metadata[3].location);
        console.log("Testing 123 ", All_Metadata[3].gender);
        console.log("Testing 123 ", All_Metadata[3].ethnicity);
        console.log("Testing 123 ", All_Metadata[3].bbtype);
        console.log("Testing 123 ", All_Metadata[3].wfreq);

        // fills the dropdown with list of values for selection
        All_Names.forEach((sampleID) =>
        {
            sampleInputElement.append("option")
            .text(sampleID)
            .property("value", sampleID);
        });


        optionChanged();
    });

    //UpdateDemographic();

    console.log("Exiting initialize()");
}



function optionChanged() {

    console.log("Entering optionChanged()");

    var sampleInputElement = d3.select("#selDataset");
    var sampleID = sampleInputElement.property("value");

    function GetSpecificSample(dataset_rows)
    {
        return dataset_rows.id == sampleID;
    }

    var metadata = All_Metadata.filter(GetSpecificSample)[0];
    var samples = All_Samples.filter(GetSpecificSample)[0];
    
    console.log("metadata is: ", metadata);
    console.log("samples are: ", samples);

    UpdateDemographic(metadata);
    UpdateBarChart(samples);
    UpdateBubbleChart(samples);
    UpdateGaugeChart(metadata);

    console.log("Exiting optionChanged()");
}

function UpdateDemographic(metadata) {

    console.log("Entering UpdateDemographic()");

    var sampleMetadataArea = d3.select("#sample-metadata");
    sampleMetadataArea.html("");

    sampleMetadataArea.append("div").text(`Id:  ${metadata.id}`);
    sampleMetadataArea.append("div").text(`Ethnicity:  ${metadata.ethnicity}`)
    sampleMetadataArea.append("div").text(`Gender:  ${metadata.gender}`)
    sampleMetadataArea.append("div").text(`Age:  ${metadata.age}`)
    sampleMetadataArea.append("div").text(`Locatiom:  ${metadata.location}`)
    sampleMetadataArea.append("div").text(`BB Type:  ${metadata.bbtype}`)
    sampleMetadataArea.append("div").text(`Washing Freq:  ${metadata.wfreq}`)

    console.log("Exiting UpdateDemographic()");
}

function UpdateBarChart(samples) {

    console.log("Entering UpdateBarChart()");

    console.log("Samples = ", samples);

    d3.select("#bar").html("");

    // For some reason this prevents the same sample from
    // being selected again and rendering correctly

    // // Descending Order Sort
    // let indexOrder = samples.sample_values
    // .map((a, i) => [a, i])
    // .sort((a, b) => b[0] - a[0])
    // .map(a => a[1]);
  
    // for (let k in samples) {
    //     samples[k] = indexOrder.map(i => samples[k][i]);
    // }

    // Do Stuff
    // Use sample_values as the values for the bar chart.
    // Use otu_ids as the labels for the bar chart.
    // Use otu_labels as the hovertext for the chart.

    otuIDs = samples.otu_ids.slice(0,10).reverse();
    sampleValues = samples.sample_values.slice(0,10).reverse();
    otuLabels = samples.otu_labels.slice(0,10).reverse();

    console.log("otuIDs ", otuIDs);
    console.log("sampleValues ", sampleValues);
    console.log("otuLabels ", otuLabels);

    // Trace1 for the Greek Data
    var trace1 = {
        type: "bar",
        orientation: "h",
        x: sampleValues,
        y: otuIDs.map(id => "OTU " + id.toString()),
        text: otuLabels
    };

    var data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
        title: "OTU Samples",
        // margin: {
        // l: 100,
        // r: 100,
        // t: 100,
        // b: 100
        // }
    };

    // // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);

    console.log("Exiting UpdateBarChart()");
}

function UpdateBubbleChart(samples) {

    console.log("Entering UpdateBubbleChart()");

    console.log("Samples = ", samples);

    d3.select("#bubble").html("");

    // Do Stuff

    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.   
    // Use otu_labels for the text values.

    otuIDs = samples.otu_ids;
    //otuIDs = samples.otu_ids.map(id => "OTU " + id.toString());
    sampleValues = samples.sample_values;
    otuLabels = samples.otu_labels;

    console.log("otuIDs ", otuIDs);
    console.log("sampleValues ", sampleValues);
    console.log("otuLabels ", otuLabels);

    // Trace1 for the Greek Data
    var trace1 = {
        type: "bubble",
        //x: otuIDs.map(id => "OTU " + id.toString()),
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: otuIDs,
            size: sampleValues,
            //sizes: c(10, 50),
            //sizes: 2.*Math.max(sampleValues)/(40.**2),
            sizeref: 1.5
            //sizemin: 4
        }
    };

    // data
    var data = [trace1];

    // Apply the group bubble mode to the layout
    var layout = {
        title: "OTU Samples",
        xaxis: {
            title: "OTU ID"
        }
    };

    // // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", data, layout);

    console.log("Exiting UpdateBubbleChart()");
}


function UpdateGaugeChart(metadata) {

    console.log("Entering UpdateGaugeChart()");

    console.log("Metadata = ", metadata);

    d3.select("#gauge").html("");

    var traceA = {
        type: "pie",
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 90],
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
        //   colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "white"]
          colors: [ "rgba(248, 243, 236, 0.6)", "rgba(244, 241, 228, 0.6)", 
                    "rgba(233, 231, 201, 0.6)", "rgba(229, 232, 176, 0.6)", 
                    "rgba(213, 229, 153, 0.6)", "rgba(183, 205, 143, 0.6)",
                    "rgba(139, 192, 134, 0.6)", "rgba(137, 188, 141, 0.6)",
                    "rgba(132, 181, 137, 0.6)", "white"]
        },
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        hoverinfo: "label"
    };

    // get a value between 0 and 180

    //var value = (4.5 / 9) * 180;
    var value = (metadata.wfreq / 9) * 180;
    var degrees = value-90, radius = 0.25;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.sin(radians);
    var y = radius * Math.cos(radians);

    console.log("radians = ", radians);
    console.log("X = ", x);
    console.log("Y = ", y);

    var layout = {
        shapes:[{
            type: 'line',
            x0: 0.5,
            y0: 0.5,
            x1: x + 0.5,
            y1: y + 0.5,
            line: {
                color: 'black',
                width: 8
            }
        }],
        title: 'Belly Button Washing Frequency <br> Scrubs per Week',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
    };
 
    var data = [traceA];

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("gauge", data, layout);

    console.log("Exiting UpdateGaugeChart()");
}