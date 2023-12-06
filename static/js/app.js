//  Use the D3 to read in data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//  Function to initialize page
function init() {
  //  Fetch JSON data to use in other functions
  d3.json(url).then(function(data) {
    populateDropdown(data.names);
    optionChanged(data.names[0], data);
  });
}

//  Function to populate dropdown menu
function populateDropdown(names) {
  let dropdownMenu = d3.select("#selDataset");
    names.forEach(name => {
      dropdownMenu
      .append("option")
      .text(name)
      .property("value", name);
    });
}

//  Function to update charts and metadata w new sample
function optionChanged(sample, data) {
  if (!data) {
    d3.json(url).then(newSample => {
      updateChartsAndMetadata( sample, newSample);
    });
  } else {
    updateChartsAndMetadata(sample, data);
  }
}

//  Function to update charts and metadata
function updateChartsAndMetadata(sample, data) {
  let selectedData = data.samples.filter(s => s.id === sample)[0];
  let metaData = data.metadata.filter(m => m.id == sample)[0];
  
  updateMetadata(metaData);
  hbarChart(selectedData);
  bubbleChart(selectedData);
}

// Function to create a horizontal bar chart
function hbarChart(selectedData) {
  let barData = [{
    type: 'bar',
    x: selectedData.sample_values.slice(0, 10).reverse(),
    y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: selectedData.otu_labels.slice(0, 10).reverse(),
    orientation: 'h'
  }];

  let barLayout = {
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU ID" }
  };

  Plotly.newPlot('bar', barData, barLayout);
}

// Function to create a bubble chart
function bubbleChart(selectedData) {
  let bubbleData = [{
    x: selectedData.otu_ids,
    y: selectedData.sample_values,
    mode: 'markers',
    marker: {
      color: selectedData.otu_ids,
      opacity: 0.8,
      size: selectedData.sample_values
    },
    text: selectedData.otu_labels
  }];

  let bubbleLayout = {
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" }
  };

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Function to update metadata
function updateMetadata(metaData) {
  let metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html("");
  Object.entries(metaData).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Initialize the page
init();
