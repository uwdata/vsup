import * as d3 from "d3";

export function continuousSquare(m_size, m_scale, m_id) {
  let el = null;
  let size = m_size;
  let id = m_id;
  let scale = m_scale;
  let context;
  let canvas;

  function square(nel) {
    el = nel;
    square.make();
  }

  square.makePixelData = function () {
    const pixelData = [];
    let c;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
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
  };

  square.make = function () {
    if (!el) {
      return;
    }

    if (!canvas) {
      canvas = el.append("canvas");
    }

    canvas.attr("width", size).attr("height", size);

    if (id) {
      canvas.attr("id", id);
    }

    const cnode = canvas.node();
    context = cnode.getContext("2d");

    square.setPixels();
  };

  square.setPixels = function () {
    const img = context.createImageData(size, size);
    img.data.set(square.makePixelData());
    context.putImageData(img, 0, 0);
  };

  square.size = function (newSize) {
    if (!arguments.length) {
      return size;
    } else {
      size = newSize;
      if (canvas) {
        canvas.attr("width", size).attr("height", size);

        square.setPixels();
      }
      return square;
    }
  };

  square.scale = function (newScale) {
    if (!arguments.length) {
      return scale;
    } else {
      scale = newScale;
      if (canvas) {
        square.setPixels();
      } else {
        square.make();
      }
      return square;
    }
  };

  square.id = function (newId) {
    if (!arguments.length) {
      return id;
    } else {
      id = newId;
      if (canvas) {
        canvas.attr("id", id);
      }
      return square;
    }
  };

  return square;
}

export function continuousArc(m_size, m_scale) {
  const arc = continuousSquare(m_size, m_scale);

  arc.makePixelData = function () {
    const pixelData = [];
    let c;
    let x;
    let y;
    let theta;
    let r;
    const angle = d3
      .scaleLinear()
      .domain([-Math.PI / 6, Math.PI / 6])
      .range([1, 0]);
    var size = arc.size();

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        x = j / size - 0.5;
        y = 1 - i / size;
        r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        theta = Math.atan2(y, x) - Math.PI / 2;

        if (theta > -Math.PI / 6 && theta < Math.PI / 6 && r > 0 && r < 1) {
          c = arc.scale()(angle(theta));
          c = d3.interpolateLab(c, d3.color("#ddd"))(1 - r);
          c = d3.color(c);
        } else {
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
  };

  return arc;
}

export function continuousLine(m_length, m_width, m_scale) {
  const line = continuousSquare(m_length, m_scale);
  const width = m_width;
  const length = m_length;

  line.makePixelData = function () {
    const pixelData = [];
    let c;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (i < width) {
          c = line.scale()(j / length);
          c = d3.color(c);
          pixelData.push(c.r);
          pixelData.push(c.g);
          pixelData.push(c.b);
          pixelData.push(255);
        } else {
          pixelData.push(255);
          pixelData.push(255);
          pixelData.push(255);
          pixelData.push(0);
        }
      }
    }
    return pixelData;
  };

  return line;
}
