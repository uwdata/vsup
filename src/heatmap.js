/*
A lightweight factory for making d3 heatmaps.
*/
import * as d3 from "d3";

export function simpleHeatmap(data, m_scale, m_size, m_id, m_x, m_y) {
  let x = m_x ? m_x : 0;
  let y = m_y ? m_y : 0;
  let size = m_size ? m_size : 0;
  let scale = m_scale ? m_scale : () => "#fff";
  let id = m_id;
  let h;

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

    heatmap.svgGroup.attr("transform", `translate(${x},${y})`);

    heatmap.svgGroup
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .selectAll("rect")
      .data((d, i) => d.map(val => ({
      r: i,
      v: val
    })))
      .enter()
      .append("rect")
      .datum(function(d, i) {
        d.c = i;
        return d;
      });

    heatmap.svgGroup
      .selectAll("g")
      .selectAll("rect")
      .attr("x", d => size / data[d.r].length * d.c)
      .attr("y", d => d.r * h)
      .attr("width", d => size / data[d.r].length)
      .attr("height", h)
      .attr("fill", d => scale(d.v));

    if (id) {
      heatmap.svgGroup.attr("id", id);
    }
  };

  heatmap.data = function(newData) {
    if (!arguments.length) {
      return data;
    } else {
      data = newData;
      h = size / data.length;
      heatmap.setProperties();
      return heatmap;
    }
  };

  heatmap.x = function(newX) {
    if (!arguments.length) {
      return x;
    } else {
      x = newX;
      heatmap.setProperties();
      return heatmap;
    }
  };

  heatmap.y = function(newY) {
    if (!arguments.length) {
      return y;
    } else {
      y = newY;
      heatmap.setProperties();
      return heatmap;
    }
  };

  heatmap.size = function(newSize) {
    if (!arguments.length) {
      return size;
    } else {
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
    } else {
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
    } else {
      id = newId;
      heatmap.setProperties();
      return heatmap;
    }
  };

  return heatmap;
}

export function simpleArcmap(data, m_scale, m_size, m_id, m_x, m_y) {
  const arcmap = simpleHeatmap(data, m_scale, m_size, m_id, m_x, m_y);

  function makeArc(d, size, rows, cols) {
    const angle = d3
      .scaleLinear()
      .domain([0, cols])
      .range([-Math.PI / 6, Math.PI / 6]);
    const radius = d3
      .scaleLinear()
      .domain([0, rows])
      .range([size, 0]);

    const arcPath = d3
      .arc()
      .innerRadius(radius(d.r + 1))
      .outerRadius(radius(d.r))
      .startAngle(angle(d.c))
      .endAngle(angle(d.c + 1));

    return arcPath();
  }

  arcmap.setProperties = function() {
    var data = arcmap.data();
    var size = arcmap.size();
    var scale = arcmap.scale();
    var id = arcmap.id();
    var x = arcmap.x();
    var y = arcmap.y();

    if (!arcmap.el) {
      return;
    }

    if (!arcmap.svgGroup) {
      arcmap.svgGroup = arcmap.el.append("g");
    }

    arcmap.svgGroup.attr("transform", `translate(${x},${y})`);

    arcmap.svgGroup
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .selectAll("path")
      .data((d, i) => d.map(val => ({
      r: i,
      v: val
    })))
      .enter()
      .append("path")
      .datum(function(d, i) {
        d.c = i;
        return d;
      });

    arcmap.svgGroup
      .selectAll("g")
      .selectAll("path")
      .attr("transform", `translate(${size / 2.0},${size})`)
      .attr("d", d => makeArc(d, size, data.length, data[d.r].length))
      .attr("fill", d => scale(d.v));

    if (id) {
      arcmap.svgGroup.attr("id", id);
    }
  };

  return arcmap;
}
