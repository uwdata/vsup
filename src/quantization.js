import * as d3 from "d3";

export function linearQuantization(m_n, m_range) {
  var n = m_n,
  range = m_range,
  scale = makeScale();

  function makeScale() {
    return d3.scaleQuantize().range(d3.quantize(range, n));
  }

  function quantization(value) {
    return scale(value);
  }


  quantization.range = function() {
    return scale.range();
  }

  quantization.n = function(newN) {
    if (!arguments.length) {
      return n;
    }
    else {
      n = newN;
      scale = makeScale();
      return quantization;
    }
  }

  return quantization;
}

export function squareQuantization(m_n) {
  var n = m_n,
    uscale = d3.scaleLinear(),
    vscale = d3.scaleLinear(),
    matrix = makeMatrix();

  function quantization(value, uncertainty) {
    var u = uncertainty != undefined ? uncertainty : value.u,
      v = uncertainty != undefined ? value : value.v,
      i = 0;

    // find the right layer of the tree, based on uncertainty
    while (i < matrix.length - 1 && uscale(u) < 1 - ((i + 1) / n)){
      i++;
    }

    // find right leaf of tree, based on value
    var vgap = (matrix[i].length > 1) ? (matrix[i][1].v - matrix[i][0].v) / 2 : 0,
        j = 0;

    while (j < (matrix[i].length - 1) && v > matrix[i][j].v + vgap){
      j++;
    }

    return matrix[i][j];
  }

  function makeMatrix() {
    var matrix = [];

    uscale.nice(n);
    vscale.nice(n);

    for (var i = 0; i < n; i++){
      matrix[i] = [];
      for (var j = 1; j < (2 * n); j += 2){
        matrix[i].push({ u: uscale.invert(1 - ((i + 1) / n)), v: vscale.invert(j / (2 * n))});
      }
    }

    return matrix;
  }

  quantization.range = function() {
    return [].concat.apply([], matrix);
  }

  quantization.n = function(newN) {
    if (!arguments.length) {
      return n;
    }
    else {
      n = newN;
      matrix = makeMatrix();
      return quantization;
    }
  }

  quantization.matrix = function() {
    return matrix;
  }

  quantization.data = quantization.matrix;

  quantization.uncertaintyDomain = function(newDomain) {
    if (!arguments.length) {
      return uscale.domain();
    }
    else {
      uscale.domain(newDomain);
      matrix = makeMatrix();
      return quantization;
    }
  }

  quantization.valueDomain = function(newDomain) {
    if (!arguments.length) {
      return vscale.domain();
    }
    else {
      vscale.domain(newDomain);
      matrix = makeMatrix();
      return quantization;
    }
  }

  return quantization;
}

export function treeQuantization(branchingFactor, treeLayers) {
  var branch = branchingFactor || 2,
    layers = treeLayers || 2,
    uscale = d3.scaleLinear(),
    vscale = d3.scaleLinear(),
    tree = makeTree();

  function quantization(value, uncertainty) {
    var u = uncertainty != undefined ? uncertainty : value.u,
        v = uncertainty != undefined ? value : value.v,
        i = 0;

    // find the right layer of the tree, based on uncertainty
    while (i < tree.length - 1 && uscale(u) < 1 - ((i + 1) / layers)){
      i++;
    }

    // find right leaf of tree, based on value
    var vgap = (tree[i].length > 1) ? (tree[i][1].v - tree[i][0].v) / 2 : 0,
        j = 0;

    while (j < (tree[i].length - 1) && v > tree[i][j].v + vgap){
      j++;
    }

    return tree[i][j];
  }

  function makeTree() {
    // Our tree should be "squarish" - it should have about
    // as many layers as leaves.
    var tree = [],
      n;

    vscale.nice(Math.pow(branch, layers - 1));
    uscale.nice(layers);

    tree[0] = [];
    tree[0].push({u: uscale.invert((layers - 1) / layers), v: vscale.invert(0.5)});

    for (var i = 1; i < layers; i++){
      tree[i] = [];
      n = 2 * Math.pow(branch, i);
      for (var j = 1; j < n; j += 2){
        tree[i].push({ u: uscale.invert(1 - ((i + 1) / layers)), v: vscale.invert(j / n)});
      }
    }
    return tree;
  }

  quantization.tree = function() {
    return tree;
  }

  quantization.data = quantization.tree;

  quantization.branching = function(newbranch) {
    if (!arguments.length) {
      return branch;
    }
    else {
      branch = Math.max(1, newbranch);
      tree = makeTree();
      return quantization;
    }
  }

  quantization.layers = function(newlayers) {
    if (!arguments.length) {
      return layers;
    }
    else {
      layers = Math.max(1, newlayers);
      tree = makeTree();
      return quantization;
    }
  }

  quantization.range = function() {
    return [].concat.apply([], tree);
  }

  quantization.uncertaintyDomain = function(uDom) {
    if (!arguments.length) {
      return uscale.domain();
    }
    else {
      uscale.domain(uDom);
      tree = makeTree();
      return quantization;
    }
  }

  quantization.valueDomain = function(vDom) {
    if (!arguments.length) {
      return vscale.domain();
    }
    else {
      vscale.domain(vDom);
      tree = makeTree();
      return quantization;
    }
  }

  return quantization;
}
