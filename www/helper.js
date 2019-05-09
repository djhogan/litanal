function Element(tag, width, height) {
  this.tag = tag
  this.width = width
  this.height = height
  this.children = []
}

Element.prototype.initialize = function(svg) {
  this.svg = svg
    .attr("width", this.width)
    .attr("height", this.height)
  console.log(this.children)
  for (var child of this.children) { //.forEach(function(child) {
    console.log(child)
    svgchild = this.svg.append(child.elem.tag)
      .attr("transform", "translate(" + child.x + " " + child.y + ")")
    child.elem.initialize(svgchild)
  } //)
  if (this.hasOwnProperty('postInitialize')) {
    this.postInitialize()
  }
}

Element.prototype.update = function(data) {
  if (this.hasOwnProperty('updateWithData')) {
    this.updateWithData(data)
  }
  for (var child of this.children) {
    child.elem.update(data);
  }
}

module.exports = Element;
