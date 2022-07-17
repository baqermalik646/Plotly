
// builds initial plot when refreshed
function init(){
    buildPlot()
}

// Will apply once option is changed
function optionChanged() {
    buildPlot();
}


// builds the new plot.
function buildPlot(){

    d3.json("samples.json").then((data) =>{
        //list od all names
        var idValues = data.names;

        // Dropdown menu by inserting id name
        idValues.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));

        // Get current id using d3 and store as a variable
        var currentID = d3.selectAll("#selDataset").node().value;

        // filter data to get indo for the current id
        filteredID = data.samples.filter(entry => entry.id == currentID);

        // Trace for the horizontal bar chart
        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };

        var dataPlot = [trace1];

        var layout = {
            title : 'Top 10 OTUs',
            margin: {
                l: 70,
                r: 100,
                t: 60,
                b: 60
            }

        };

        // create new bar
        Plotly.newPlot("bar", dataPlot, layout);

        // Demographics panel
        filteredMeta = data.metadata.filter(entry => entry.id == currentID)

        // Demographics object
        var demographics = {
            'id: ': filteredMeta[0].id,
            'ethnicity: ': filteredMeta[0].ethnicity,
            'gender: ': filteredMeta[0].gender,
            'age: ': filteredMeta[0].age,
            'location: ': filteredMeta[0].location,
            'bbtype: ': filteredMeta[0].bbtype,
            'wfreq: ': filteredMeta[0].wfreq
        }
        //select the id to append the key value pair under demographics panel
        panelBody = d3.select("#sample-metadata")

        // Remove current demographic information for the new currentID variable
        panelBody.html("")

        //Add key value pairs from Demographics to the Demographics panel
        Object.entries(demographics).forEach(([key, value]) => {
            panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
        });

        // Trace for Bubble Chart
        var trace2 ={
            x : filteredID[0].otu_ids,
            y : filteredID[0].sample_values,
            text : filteredID[0].otu_labels,
            mode : 'markers',
            marker: {
                color : filteredID[0].otu_ids,
                size : filteredID[0].sample_values
            }
        }

        var data2 = [trace2]

        //Layout for Bubble Chart
        var layout2 = {
            title : 'Bubble Chart',
            xaxis:{title: "OTU ID"},
            showlegend : false,

        }

        Plotly.newPlot('bubble', data2, layout2)
        console.log(filteredID)
        gauge()
    });
};

init();
