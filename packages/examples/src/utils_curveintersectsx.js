export default part => {
  let {
    Point,
    points,
    Path,
    paths,
    utils,
    snippets,
    Snippet
  } = part.shorthand();

  points.start = new Point(10, 15);
  points.cp1 = new Point(80, 10);
  points.cp2 = new Point(-50, 80);
  points.end = new Point(110, 70);

  paths.curve = new Path()
    .move(points.start)
    .curve(points.cp1, points.cp2, points.end);

  for (let x of [30, 40]) {
    points["from" + x] = new Point(x, 10);
    points["to" + x] = new Point(x, 80);
    paths["line" + x] = new Path()
      .move(points["from" + x])
      .line(points["to" + x])
      .attr("class", "lining dashed");
  }

  snippets.i40 = new Snippet(
    "notch",
    utils.curveIntersectsX(points.start, points.cp1, points.cp2, points.end, 40)
  );

  for (let p of utils.curveIntersectsX(
    points.start,
    points.cp1,
    points.cp2,
    points.end,
    30
  ))
    snippets[p.y] = new Snippet("notch", p);

  return part;
};
