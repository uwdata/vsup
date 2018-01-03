import * as d3 from "d3";

export function continuousSquare(m_size, m_scale, m_id){
  var el = null,
    size = m_size,
    id = m_id,
    scale = m_scale,
    context,
    canvas;

  function square(nel) {
    el = nel;
    square.make();
  }

  square.makePixelData = function() {
      var pixelData = [];
      var c;
      for (var i = 0;i < size;i++) {
        for (var j = 0;j < size;j++) {
          c = scale(j / size);
          c = d3.interpolateLab(c, d3.color("#ddd"))(i / size);
          //r,g,b,a
          c = d3.color(c);
          pixelData.push(c.r);
          pixelData.push(c.g);
          pixelData.push(c.b);
          pixelData.push(255);
        }
      }
      return pixelData;
  }

  square.make = function() {
    if (!el) {
      return;
    }

    if (!canvas) {
      canvas = el.append("canvas")
    }

    canvas
      .attr("width", size)
      .attr("height", size);

    if (id) {
      canvas.attr("id", id);
    }

    var cnode = canvas.node();
    context = cnode.getContext("2d");

    square.setPixels();
  }

  square.setPixels = function() {
    var img = context.createImageData(size, size);
    img.data.set(square.makePixelData());
    context.putImageData(img, 0, 0);
  }

  square.size = function(newSize) {
    if (!arguments.length) {
      return size;
    }
    else {
      size = newSize;
      if (canvas) {
        canvas
          .attr("width", size)
          .attr("height", size);

        square.setPixels();
      }
      return square;
    }
  }

  square.scale = function(newScale) {
    if (!arguments.length) {
      return scale;
    }
    else {
      scale = newScale;
      if (canvas) {
        square.setPixels();
      }
      else {
        square.make();
      }
      return square;
    }
  }

  square.id = function(newId) {
    if (!arguments.length) {
      return id;
    }
    else {
      id = newId;
      if (canvas) {
        canvas.attr("id", id);
      }
      return square;
    }
  }

  return square;
}

export function continuousArc(m_size, m_scale) {
  var arc = continuousSquare(m_size, m_scale);

  arc.makePixelData = function() {
    var pixelData = [];
    var c, x, y, theta, r;
    var angle = d3.scaleLinear().domain([-Math.PI / 6, Math.PI / 6]).range([1, 0]);
    var size = arc.size();

    for (var i = 0;i < size;i++) {
      for (var j = 0;j < size;j++) {
        x = (j / size) - 0.5;
        y = 1 - (i / size);
        r = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2));
        theta = Math.atan2(y, x) - (Math.PI / 2) ;

        if (theta > -Math.PI / 6 && theta < Math.PI / 6 && r > 0 && r < 1){
          c = arc.scale()(angle(theta));
          c = d3.interpolateLab(c, d3.color("#ddd"))(1 - r);
          c = d3.color(c);
        }
        else {
          c = d3.color("white");
          c.opacity = 0;
        }

        pixelData.push(c.r);
        pixelData.push(c.g);
        pixelData.push(c.b);
        pixelData.push(255 * c.opacity);
      }
    }
    return pixelData;
  }

  return arc;
}

export function continuousLine(m_length, m_width, m_scale) {
  var line = continuousSquare(m_length, m_scale);
  var width = m_width;
  var length = m_length;

  line.makePixelData = function() {
    var pixelData = [];
    var c;
    for (var i = 0;i < length;i++) {
      for (var j = 0;j < length;j++) {
        if (i < width) {
          c = line.scale()(j / length);
          c = d3.color(c);
          pixelData.push(c.r);
          pixelData.push(c.g);
          pixelData.push(c.b);
          pixelData.push(255);
        }
        else {
          pixelData.push(255);
          pixelData.push(255);
          pixelData.push(255);
          pixelData.push(0);
        }
      }
    }
    return pixelData;
  }

  return line;
}
