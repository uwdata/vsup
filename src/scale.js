import * as d3 from "d3";

// Returns a color, based on a bivariate data point,
// a quantization function, and a color interpolator
// can be extended to different modes (just saturation, say)
export function simpleScale(m_mode, m_range, m_quantization) {
  let range = m_range || d3.interpolateViridis;

  let quantization =
    m_quantization ||
    function(v, u) {
      const data = u != undefined ? { v: v, u: u } : { v: v.v, u: v.u };
      return data;
    };

  let mode = m_mode;

  function CIEDist(color1, color2) {
    const c1 = d3.lab(d3.color(color1));
    const c2 = d3.lab(d3.color(color2));
    return Math.sqrt(
      Math.pow(c1.l - c2.l, 2) +
        Math.pow(c1.a - c2.a, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
  }

  function map(value, uncertainty) {
    const data = quantization(value, uncertainty);

    let uDom = [0, 1];
    let vDom = [0, 1];

    if (quantization.uncertaintyDomain) {
      uDom = quantization.uncertaintyDomain();
    }
    if (quantization.valueDomain) {
      vDom = quantization.valueDomain();
    }

    const uScale = d3
      .scaleLinear()
      .domain(uDom)
      .range([0, 1]);
    const vScale = d3
      .scaleLinear()
      .domain(vDom)
      .range([0, 1]);

    let vcolor = range(vScale(data.v));

    switch (mode) {
      case "usl":
      default:
        vcolor = d3.interpolateLab(vcolor, "#fff")(uScale(data.u));
        break;
      case "us": {
        vcolor = d3.hsl(vcolor);
        const sScale = d3
          .scaleLinear()
          .domain([0, 1])
          .range([vcolor.s, 0]);
        vcolor.s = sScale(uScale(data.u));
        break;
      }
      case "ul": {
        vcolor = d3.hsl(vcolor);
        const lScale = d3
          .scaleLinear()
          .domain([0, 1])
          .range([vcolor.l, 1]);
        vcolor.l = lScale(uScale(data.u));
        break;
      }
    }
    return vcolor;
  }

  map.colorList = function() {
    return this.quantize()
      .range()
      .map(d => map(d));
  };

  map.colorDists = function() {
    const clist = this.colorList();
    const matrix = new Array(clist.length);
    let minDist;
    let minPair = new Array(2);
    let dist;

    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(clist.length);
      for (let j = 0; j < matrix[i].length; j++) {
        dist = CIEDist(clist[i], clist[j]);
        matrix[i][j] = dist;
        if (i != j && ((i == 0 && j == 1) || dist < minDist)) {
          minDist = dist;
          minPair = [clist[i], clist[j]];
        }
      }
    }

    matrix.minDist = minDist;
    matrix.minPair = minPair;
    return matrix;
  };

  map.mode = function(newMode) {
    if (!arguments.length) {
      return mode;
    } else {
      mode = newMode;
      return map;
    }
  };

  map.range = function(newRange) {
    if (!arguments.length) {
      return range;
    } else {
      range = newRange;
      return map;
    }
  };

  map.quantize = function(newQuantization) {
    if (!arguments.length) {
      return quantization;
    } else {
      quantization = newQuantization;
      return map;
    }
  };

  return map;
}
