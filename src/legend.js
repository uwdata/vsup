/*
  A lightweight factory for making legends.
*/
import * as d3 from "d3";

import {simpleHeatmap, simpleArcmap} from "./heatmap";

export function simpleLegend(m_scale, m_size, m_height, m_format, m_title, m_x, m_y) {
  var el = null,
      title = m_title,
      scale = m_scale ? m_scale : null,
      size = m_size ? m_size : 200,
      height = m_height ? m_height : 30,
      fmat = m_format || null,
      x = m_x ? m_x : 0,
      y = m_y ? m_y : 0;

  function legend(nel) {
    el = nel;
    legend.setProperties();
  }

  legend.setProperties = function() {
    if (!el) {
      return;
    }

    var domain = scale.domain ? scale.domain() : [0, 1],
        w = size / scale.range().length,
        step = (domain[1] - domain[0]) / scale.range().length,
        dom = d3.range(domain[0], domain[1] + step, step),
        axisScale = d3.scalePoint().range([0, size]).domain(dom).round(true);

    el
      .attr("class", "legend")
      .attr("transform", "translate(" + x + "," + y + ")");

    var rect = el.selectAll("rect").data(scale.range())

    rect.enter()
        .append("rect")
      .merge(rect)
        .attr("x", function(d, i) { return i * w; })
        .attr("y", 0)
        .attr("height", height)
        .attr("width", w)
        .attr("fill", function(d) { return d; });

    var axis = el.select("g.legend > g");
    if (axis.empty()) {
      axis = el.append("g");
    }
    axis
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(axisScale).tickFormat(d3.format(fmat || "")));

    var label = el.select("g.legend > text");
    if (label.empty()) {
      label = el.append("text");
    }
    label
      .style("text-anchor", "middle")
      .style("font-size", 13)
      .attr("transform", "translate(" + (size / 2) + ", " + (height + 30) + ")")
      .text(title);
  };

  legend.title = function(t) {
    if (!arguments.length) {
      return title;
    }
    else {
      title = t;
      legend.setProperties();
      return legend;
    }
  };

  legend.scale = function(s) {
    if (!arguments.length) {
      return scale;
    }
    else {
      scale = s;
      legend.setProperties();
      return legend;
    }
  };

  legend.size = function(s) {
    if (!arguments.length) {
      return size;
    }
    else {
      size = s;
      legend.setProperties();
      return legend;
    }
  };

  legend.height = function(h) {
    if (!arguments.length) {
      return height;
    }
    else {
      height = h;
      legend.setProperties();
      return legend;
    }
  };

  legend.format = function(f) {
    if (!arguments.length) {
      return fmat;
    }
    else {
      fmat = f;
      legend.setProperties();
      return legend;
    }
  };

  legend.x = function(nx) {
    if (!arguments.length) {
      return x;
    }
    else {
      x = nx;
      legend.setProperties();
      return legend;
    }
  };

  legend.y = function(ny) {
    if (!arguments.length) {
      return y;
    }
    else {
      y = ny;
      legend.setProperties();
      return legend;
    }
  };

  return legend;
}

export function heatmapLegend(m_scale, m_size, m_format, m_utitle, m_vtitle, m_x, m_y) {
  var el = null,
    utitle = m_utitle ? m_utitle : "Uncertainty",
    vtitle = m_vtitle ? m_vtitle : "Value",
    scale = m_scale ? m_scale : null,
    size = m_size ? m_size : 200,
    fmat = m_format || null,
    x = m_x ? m_x : 0,
    y = m_y ? m_y : 0,
    data = null;

  var heatmap = simpleHeatmap();

  var legend = function(nel) {
    el = nel;
    legend.setProperties();

    el.call(heatmap);
  }

  legend.setProperties = function() {
    if (!el) {
      return;
    }

    var tmp = data;
    if (!tmp) {
      tmp = scale.quantize().data();
    }

    var inverted = [];
    for (var i = 0; i < tmp.length; i++) {
      inverted[i] = tmp[tmp.length - i - 1];
    }

    heatmap.y(1);  // don't hide x-axis
    heatmap.data(inverted);
    heatmap.scale(scale);
    heatmap.size(size);

    el
      .attr("class", "legend")
      .attr("transform", "translate(" + x + "," + y + ")");

    var uncertaintyDomain = scale.quantize().uncertaintyDomain();
    var uStep = (uncertaintyDomain[1] - uncertaintyDomain[0]) / inverted.length;
    var uDom = d3.range(uncertaintyDomain[0], uncertaintyDomain[1] + uStep, uStep);

    var valueDomain = scale.quantize().valueDomain();
    var vStep = (valueDomain[1] - valueDomain[0]) / inverted.length;
    var vDom = d3.range(valueDomain[0], valueDomain[1] + vStep, vStep);

    var xAxisScale = d3.scalePoint().range([0, size]).domain(vDom);

    el.append("g")
      .call(d3.axisTop(xAxisScale).tickFormat(d3.format(fmat || "")));

    el.append("text")
      .style("text-anchor", "middle")
      .style("font-size", 13)
      .attr("transform", "translate(" + (size / 2) + ", " + (-25) + ")")
      .text(vtitle);

    var yAxis = d3.scalePoint().range([0, size]).domain(uDom);

    el.append("g")
      .attr("transform", "translate(" + size + ", 0)")
      .call(d3.axisRight(yAxis).tickFormat(d3.format(fmat || "")));

    el.append("text")
      .style("text-anchor", "middle")
      .style("font-size", 13)
      .attr("transform", "translate(" + (size + 40) + ", " + (size / 2) + ")rotate(90)")
      .text(utitle);
  };

  legend.data = function(newData) {
    if (!arguments.length) {
      return data;
    }
    else {
      data = newData;
      legend.setProperties();
      return legend;
    }
  };

  legend.scale = function(s) {
    if (!arguments.length) {
      return scale;
    }
    else {
      scale = s;
      legend.setProperties();
      return legend;
    }
  };

  legend.size = function(s) {
    if (!arguments.length) {
      return size;
    }
    else {
      size = s;
      legend.setProperties();
      return legend;
    }
  };

  legend.format = function(f) {
    if (!arguments.length) {
      return fmat;
    }
    else {
      fmat = f;
      legend.setProperties();
      return legend;
    }
  };

  legend.x = function(nx) {
    if (!arguments.length) {
      return x;
    }
    else {
      x = nx;
      legend.setProperties();
      return legend;
    }
  };

  legend.y = function(ny) {
    if (!arguments.length) {
      return y;
    }
    else {
      y = ny;
      legend.setProperties();
      return legend;
    }
  };

  legend.utitle = function(t) {
    if (!arguments.length) {
      return utitle;
    }
    else {
      utitle = t;
      legend.setProperties();
      return legend;
    }
  };

  legend.vtitle = function(t) {
    if (!arguments.length) {
      return vtitle;
    }
    else {
      vtitle = t;
      legend.setProperties();
      return legend;
    }
  };

  return legend;
}


export function arcmapLegend(m_scale, m_size, m_format, m_utitle, m_vtitle, m_x, m_y) {
  var el = null,
    utitle = m_utitle ? m_utitle : "Uncertainty",
    vtitle = m_vtitle ? m_vtitle : "Value",
    scale = m_scale ? m_scale : null,
    size = m_size ? m_size : 200,
    fmat = m_format || null,
    x = m_x ? m_x : 0,
    y = m_y ? m_y : 0,
    data = null;

  var arcmap = simpleArcmap();

  var legend = function(nel) {
    el = nel;
    legend.setProperties();

    el.call(arcmap);
  }

  legend.setProperties = function() {
    if (!el) {
      return;
    }

    var tmp = data;
    if (!tmp) {
      tmp = scale.quantize().data();
    }

    var inverted = [];
    for (var i = 0; i < tmp.length; i++) {
      inverted[i] = tmp[tmp.length - i - 1];
    }

    arcmap.data(inverted);
    arcmap.scale(scale);
    arcmap.size(size);

    el
      .attr("class", "legend")
      .attr("transform", "translate(" + x + "," + y + ")");

    var uncertaintyDomain = scale.quantize().uncertaintyDomain();
    var uStep = (uncertaintyDomain[1] - uncertaintyDomain[0]) / inverted.length;
    var uDom = d3.range(uncertaintyDomain[0], uncertaintyDomain[1] + uStep, uStep);

    var uAxisScale = d3.scalePoint().range([0, size]).domain(uDom);

    var px = size / 180;
    el.append("g")
      .attr("transform", "translate(" + (size + 6 * px) + "," + (28 * px) + ")rotate(30)")
      .call(d3.axisRight(uAxisScale).tickFormat(d3.format(fmat || "")));

    el.append("text")
      .style("text-anchor", "middle")
      .style("font-size", 13)
      .attr("transform", "translate(" + (size + 10 * px) + "," + (40 * px + size / 2) + ")rotate(-60)")
      .text(utitle);

    var valueDomain = scale.quantize().valueDomain();
    var vStep = (valueDomain[1] - valueDomain[0]) / inverted[0].length;
    var vTicks = d3.range(valueDomain[0], valueDomain[1] + vStep, vStep);

    var vAxisScale = d3.scaleLinear().range([0, size]).domain(valueDomain);
    var valueFormat = fmat ? d3.format(fmat) : vAxisScale.tickFormat(vTicks.length);

    var angle = d3.scaleLinear()
      .domain(valueDomain)
      .range([-30, 30]);

    var offset = 3 * px;

    var myArc = d3.arc()
      .innerRadius(size + offset)
      .outerRadius(size + offset + 1)
      .startAngle(-Math.PI / 6)
      .endAngle(Math.PI / 6);

    var arcAxis = el.append("g")
      .attr("transform", "translate(" + (size / 2) + "," + (size - offset) + ")");

    arcAxis.append("path")
      .attr("fill", "black")
      .attr("stroke", "transparent")
      .attr("d", myArc);

    var labelEnter = arcAxis.selectAll(".arc-label").data(vTicks).enter()
      .append("g")
        .attr("class", "arc-label")
        .attr("transform", function(d) {
          return "rotate(" + angle(d) + ")translate(" + 0 + "," + (-size - offset) + ")";
        })

    labelEnter.append("text")
      .style("font-size", "11")
      .style("text-anchor", "middle")
      .attr("y", -10)
      .text(valueFormat);

    labelEnter.append("line")
      .attr("x1", 0.5)
      .attr("x2", 0.5)
      .attr("y1", -6)
      .attr("y2", 0)
      .attr("stroke", "#000");

    el.append("text")
      .style("text-anchor", "middle")
      .style("font-size", 13)
      .attr("x", size / 2)
      .attr("y", -30)
      .text(vtitle);
  };

  legend.data = function(newData) {
    if (!arguments.length) {
      return data;
    }
    else {
      data = newData;
      legend.setProperties();
      return legend;
    }
  };

  legend.scale = function(s) {
    if (!arguments.length) {
      return scale;
    }
    else {
      scale = s;
      legend.setProperties();
      return legend;
    }
  };

  legend.size = function(s) {
    if (!arguments.length) {
      return size;
    }
    else {
      size = s;
      legend.setProperties();
      return legend;
    }
  };

  legend.format = function(f) {
    if (!arguments.length) {
      return fmat;
    }
    else {
      fmat = f;
      legend.setProperties();
      return legend;
    }
  };

  legend.x = function(nx) {
    if (!arguments.length) {
      return x;
    }
    else {
      x = nx;
      legend.setProperties();
      return legend;
    }
  };

  legend.y = function(ny) {
    if (!arguments.length) {
      return y;
    }
    else {
      y = ny;
      legend.setProperties();
      return legend;
    }
  };

  legend.utitle = function(t) {
    if (!arguments.length) {
      return utitle;
    }
    else {
      utitle = t;
      legend.setProperties();
      return legend;
    }
  };

  legend.vtitle = function(t) {
    if (!arguments.length) {
      return vtitle;
    }
    else {
      vtitle = t;
      legend.setProperties();
      return legend;
    }
  };

  return legend;
}
