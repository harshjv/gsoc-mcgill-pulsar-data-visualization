var d3 = require('d3')

var margin = { top: 5, right: 100, bottom: 50, left: 65 }
var outerWidth = 800
var outerHeight = 600
var width = outerWidth - margin.left - margin.right
var height = outerHeight - margin.top - margin.bottom

var xAxisLabel = 'Period'
var yAxisLabel = 'Period Derivative'
var radiusLabel = 'RMS'
var colorCat = 'Pulsar'

d3.csv('/assets/data/pulsar_data_test.csv', function (data) {
  data.forEach(function (d) {
    d['Pulsar'] = d['Pulsar'] // Name
    d['TOAs'] = Number(d['TOAs']) // Time of Arrival
    d['Raw Profiles'] = Number(d['Raw Profiles']) // Number of data we have
    d['Period'] = Number(d['Period']) // Second
    d['Period Derivative'] = Number(d['Period Derivative']) // s/s
    d['DM'] = Number(d['DM']) // pc/cc
    d['RMS'] = Number(d['RMS']) // us

    if (d['Binary'] === 'Y') d['Binary'] = 'Yes'
    else d['Binary'] = 'No'
  })

  var xMax = d3.max(data, function (d) { return d[xAxisLabel] }) * 1.05
  var xMin = d3.min(data, function (d) { return d[xAxisLabel] })
  var yMax = d3.max(data, function (d) { return d[yAxisLabel] }) * 1.05
  var yMin = d3.min(data, function (d) { return d[yAxisLabel] })

  xMin = xMin > 0 ? 0 : xMin

  var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  var x = d3.scale.linear()
    .range([0, width])
    .nice()

  var y = d3.scale.log()
    .range([height, 0])

  x.domain([xMin, xMax])
  y.domain([yMin, yMax])

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickSize(-height)

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(-width)

  var color = d3.scale.category20()

  var zoomBehavior = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 500])
    .on('zoom', zoom)

  var svg = d3.select('#plot')
    .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(zoomBehavior)

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)

  svg.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .append('text')
    .classed('label', true)
    .attr('x', width)
    .attr('y', margin.bottom - 10)
    .style('text-anchor', 'end')
    .text(xAxisLabel)

  svg.append('g')
    .classed('y axis', true)
    .call(yAxis)
    .append('text')
    .classed('label', true)
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(yAxisLabel)

  var pulsors = svg.append('svg')
    .classed('objects', true)
    .attr('width', width)
    .attr('height', height)

  pulsors.append('svg:line')
    .classed('axisLine hAxisLine', true)
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', width)
    .attr('y2', 0)
    .attr('transform', 'translate(0,' + height + ')')

  pulsors.append('svg:line')
    .classed('axisLine vAxisLine', true)
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', height)

  pulsors.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .classed('dot', true)
    .attr('r', function (d) { return 6 * Math.sqrt(d[radiusLabel] / Math.PI) })
    .attr('transform', transform)
    .style('fill', function (d) { return color(d[colorCat]) })
    .on('mouseover', function (d) {
      var html = ''
      html += 'Name: ' + d['Pulsar'] + '<br/>'
      html += 'TOAs: ' + d['TOAs'] + '<br/>'
      html += 'Raw Data Files: ' + d['Raw Profiles'] + '<br/>'
      html += 'Dispersion Measure: ' + d['DM'] + ' pc/cc' + '<br/>'
      html += 'RMS: ' + d['RMS'] + ' us' + '<br/>'
      html += 'Binary System: ' + d['Binary'] + '<br/>'

      div.transition()
        .duration(200)
        .style('opacity', 0.9)
      div.html(html)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px')
    })
    .on('mouseout', function (d) {
      div.transition()
        .duration(500)
        .style('opacity', 0)
    })

  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter().append('g')
    .classed('legend', true)
    .attr('transform', function (d, i) { return 'translate(0,' + i * 20 + ')' })

  legend.append('circle')
    .attr('r', 3.5)
    .attr('cx', width + 20)
    .attr('fill', color)

  legend.append('text')
    .attr('x', width + 26)
    .attr('dy', '.35em')
    .text(function (d) { return d })

  function zoom () {
    svg.select('.x.axis').call(xAxis)
    svg.select('.y.axis').call(yAxis)

    svg.selectAll('.dot')
      .attr('transform', transform)
  }

  function transform (d) {
    return 'translate(' + x(d[xAxisLabel]) + ',' + y(d[yAxisLabel]) + ')'
  }
})
