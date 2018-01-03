/*
A lightweight factory for making d3 heatmaps.
*/
import * as d3 from "d3";

export function simpleHeatmap(data, m_scale, m_size, m_id, m_x, m_y) {
  var x = m_x ? m_x : 0,
    y = m_y ? m_y : 0,
    size = m_size ? m_size : 0,
    scale = m_scale ? m_scale : function(){ return "#fff"; },
    id = m_id,
    h;

  function heatmap(nel) {
    heatmap.el = nel;
    heatmap.setProperties();
  }
  
  heatmap.setProperties = function() {
    if (!this.el) {
      return;
    }

    if (!heatmap.svgGroup) {
      heatmap.svgGroup = heatmap.el.append("g");
    }

    heatmap.svgGroup.attr("transform", "translate(" + x + "," + y + ")");

    heatmap.svgGroup.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .selectAll("rect")
        .data(function(d, i) {
          return d.map(function(val) {
            return {r:i, v:val};
          });
        })
        .enter()
        .append("rect")
        .datum(function(d, i){
          d.c = i;
          return d;
        });

    heatmap.svgGroup.selectAll("g").selectAll("rect")
      .attr("x", function(d){ return (size / data[d.r].length) * d.c;})
      .attr("y", function(d){ return d.r * h;})
      .attr("width", function(d){ return (size / data[d.r].length);})
      .attr("height", h)
      .attr("fill", function(d){ return scale(d.v);});

    if (id) {
      heatmap.svgGroup.attr("id", id);
    }
  };

  heatmap.data = function(newData) {
    if (!arguments.length) {
      return data;
    }
    else {
      data = newData;
      h = size / data.length;
      heatmap.setProperties();
      return heatmap;
    }
  };

  heatmap.x = function(newX) {
    if (!arguments.length) {
      return x;
    }
    else {
      x = newX;
      heatmap.setProperties();
      return heatmap;
    }
  };

  heatmap.y = function(newY) {
    if (!arguments.length) {
      return y;
    }
    else {
      y = newY;
      heatmap.setProperties();
      return heatmap;
    }
  };

  heatmap.size = function(newSize) {
    if (!arguments.length) {
      return size;
    }
    else {
      size = newSize;
      if (data) {
        h = size / data.length;
        heatmap.setProperties();
      }
      return heatmap;
    }
  };

  heatmap.scale = function(newScale) {
    if (!arguments.length) {
      return scale;
    }
    else {
      scale = newScale;
      if (data) {
        heatmap.setProperties();
      }
      return heatmap;
    }
  };

  heatmap.id = function(newId) {
    if (!arguments.length) {
      return id;
    }
    else {
      id = newId;
      heatmap.setProperties();
      return heatmap;
    }
  };

  return heatmap;
}

export function simpleArcmap(data, m_scale, m_size, m_id, m_x, m_y) {
  var arcmap = simpleHeatmap(data, m_scale, m_size, m_id, m_x, m_y);

  function makeArc(d, size, rows, cols) {
    var angle = d3.scaleLinear().domain([0, cols]).range([-Math.PI / 6, Math.PI / 6]);
    var radius = d3.scaleLinear().domain([0, rows]).range([size, 0]);

    var arcPath = d3.arc()
      .innerRadius(radius(d.r + 1))
      .outerRadius(radius(d.r))
      .startAngle(angle(d.c))
      .endAngle(angle(d.c + 1));

    return arcPath();
  }

  arcmap.setProperties = function() {
    var data = arcmap.data(),
      size = arcmap.size(),
      scale = arcmap.scale(),
      id = arcmap.id(),
      x = arcmap.x(),
      y = arcmap.y();
  
    if (!arcmap.el) {
      return;
    }

    if (!arcmap.svgGroup) {
      arcmap.svgGroup = arcmap.el.append("g");
    }

    arcmap.svgGroup.attr("transform", "translate(" + x + "," + y + ")");

    arcmap.svgGroup.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .selectAll("path")
        .data(function(d, i){
          return d.map(function(val){
            return {r:i, v:val};
          });
        })
        .enter()
        .append("path")
        .datum(function(d, i){
          d.c = i;
          return d;
        });

        arcmap.svgGroup.selectAll("g").selectAll("path")
      .attr("transform", "translate(" + (size / 2.0) + "," + size + ")")
      .attr("d", function(d){ return makeArc(d, size, data.length, data[d.r].length);})
      .attr("fill", function(d){ return scale(d.v);});

    if (id) {
      arcmap.svgGroup.attr("id", id);
    }
  };

  return arcmap;
}
