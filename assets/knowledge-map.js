/*
 * AIPE Academy engineering knowledge graph.
 *
 * Renders the data in _includes/academy-knowledge-graph.html as an explorable
 * 3D network in the style of the Blog knowledge map
 * (assets/blog/knowledge-graph.js): subjects are hubs, topics sit around their
 * subject, and lines show prerequisites, subtopics and related topics. The same
 * engine serves /academy/ (every subject) and each subject page (`scope`: one
 * subject plus its direct neighbours in other subjects).
 *
 * The layout is computed from the data: positions are seeded from topic ids and
 * the force simulation settles before the first frame, so the network looks the
 * same on every visit and new topics or lessons need no changes here.
 *
 * Interactions: drag the space to rotate, drag a node to move it, pinch or
 * Ctrl/⌘ + scroll to zoom, +/−/reset buttons, click a node for its details.
 * Keyboard: the canvas rotates with the arrow keys; the topic list after it
 * (one tab stop, arrow keys to move, Enter to open) reaches every node.
 */
(function () {
  'use strict';

  var WORLD = 600; // layout units, scaled to the stage when drawn
  var INK = '36,28,16';
  var STAGE = '#f6f3ec';
  var YAW = -0.26;
  var PITCH = -0.14;
  var MIN_ZOOM = 0.6;
  var MAX_ZOOM = 2.6;
  var SETTLE_STEPS = 420;
  // Subject hubs, in Academy stage order: Foundations on the left, Power
  // Electronics above, Power Systems on the right and Renewables below.
  var SEEDS = [
    [-0.36, 0.02, -0.12],
    [0.0, -0.3, 0.16],
    [0.36, 0.0, -0.12],
    [0.02, 0.3, 0.14]
  ];
  var EDGE_STYLE = {
    member: { alpha: 0.2, near: 0.55, width: 0.8 },
    part: { alpha: 0.42, near: 0.85, width: 1.5 },
    prereq: { alpha: 0.15, near: 0.62, width: 0.8 },
    related: { alpha: 0.14, near: 0.5, width: 1, dash: [2, 4] }
  };

  function hash(text) {
    var value = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function randomFrom(text, offset) {
    return (hash(text + ':' + offset) % 10000) / 10000;
  }

  function hexToRgba(hex, alpha) {
    var value = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((value >> 16) & 255) + ',' + ((value >> 8) & 255) + ',' + (value & 255) + ',' + alpha + ')';
  }

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function html(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function init(root) {
    var stage = root.querySelector('.kg-stage');
    var canvas = root.querySelector('.kg-canvas');
    var tooltip = root.querySelector('.kg-tooltip');
    var topicList = root.querySelector('.kg-a11y');
    var panel = root.querySelector('.kg-panel');
    var panelBody = root.querySelector('.kg-panel-content');
    var panelClose = root.querySelector('.kg-panel-close');
    var dataElement = root.querySelector('.kg-data');
    if (!stage || !canvas || !panel || !panelBody || !dataElement) return;

    var data;
    try { data = JSON.parse(dataElement.textContent); } catch (error) { root.classList.add('is-unavailable'); return; }
    var context = canvas.getContext('2d');
    if (!context) { root.classList.add('is-unavailable'); return; }

    var text = data.text;
    var scope = data.scope || null;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Topics and subjects ──
    var subjectByKey = {};
    data.subjects.forEach(function (subject, index) { subject.index = index; subjectByKey[subject.key] = subject; });

    var topicById = {};
    data.nodes.forEach(function (topic) {
      topic.requires = topic.requires || [];
      topic.related = topic.related || [];
      topic.lessons = topic.lessons || [];
      topic.resources = topic.resources || [];
      topic.dependents = [];
      topic.children = [];
      topic.relatedAll = [];
      topicById[topic.id] = topic;
    });
    data.nodes.forEach(function (topic) {
      topic.requires = topic.requires.filter(function (id) { return topicById[id]; });
      topic.related = topic.related.filter(function (id) { return topicById[id]; });
      if (topic.parent && !topicById[topic.parent]) topic.parent = null;
      topic.requires.forEach(function (id) { topicById[id].dependents.push(topic.id); });
      if (topic.parent) topicById[topic.parent].children.push(topic.id);
      topic.related.forEach(function (id) {
        if (topic.relatedAll.indexOf(id) === -1) topic.relatedAll.push(id);
        if (topicById[id].relatedAll.indexOf(topic.id) === -1) topicById[id].relatedAll.push(topic.id);
      });
    });

    // Visible topics: everything, or one subject plus its direct neighbours.
    var visible = {};
    data.nodes.forEach(function (topic) { if (!scope || topic.subject === scope) visible[topic.id] = true; });
    if (scope) {
      data.nodes.forEach(function (topic) {
        if (topic.subject !== scope) return;
        topic.requires.concat(topic.dependents).forEach(function (id) { visible[id] = true; });
      });
    }

    // ── Graph ──
    var nodes = [];
    var edges = [];
    var nodeById = {};

    // The layout is stretched to the stage: wider on desktop, taller on phones.
    var shape = { x: 1, y: 1 };

    function hubHome(subject) {
      var seed = SEEDS[subject.index % SEEDS.length];
      var home;
      if (!scope) home = seed.slice();
      else if (subject.key === scope) home = [0, 0, 0];
      else {
        var origin = SEEDS[subjectByKey[scope].index % SEEDS.length];
        var direction = [seed[0] - origin[0], seed[1] - origin[1], seed[2] - origin[2]];
        var length = Math.hypot(direction[0], direction[1], direction[2]) || 1;
        home = direction.map(function (value) { return value / length * 0.34; });
      }
      return [home[0] * shape.x * WORLD, home[1] * shape.y * WORLD, home[2] * WORLD];
    }

    data.subjects.forEach(function (subject) {
      var present = data.nodes.some(function (topic) { return visible[topic.id] && topic.subject === subject.key; });
      if (!present) return;
      var external = Boolean(scope) && subject.key !== scope;
      var hub = {
        id: 'subject:' + subject.key, type: 'subject', subject: subject, title: subject.title, color: subject.color,
        external: external, radius: external ? 9 : 13
      };
      nodes.push(hub);
      nodeById[hub.id] = hub;
    });

    data.nodes.forEach(function (topic) {
      if (!visible[topic.id]) return;
      var external = Boolean(scope) && topic.subject !== scope;
      var node = {
        id: topic.id, type: 'topic', topic: topic, subject: subjectByKey[topic.subject], title: topic.title,
        color: subjectByKey[topic.subject].color, planned: !topic.lessons.length, external: external,
        radius: external ? 4.6 : topic.lessons.length ? 6.2 : 5.4
      };
      nodes.push(node);
      nodeById[node.id] = node;
    });

    var edgeIds = {};
    function addEdge(source, target, type) {
      if (!source || !target || source === target) return;
      var id = [source.id, target.id].sort().join('|');
      if (edgeIds[id]) return;
      edgeIds[id] = true;
      edges.push({ source: source, target: target, type: type });
    }
    // Subtopics hang from their parent; other topics from their subject hub.
    nodes.forEach(function (node) {
      if (node.type !== 'topic') return;
      var parent = node.topic.parent && nodeById[node.topic.parent];
      addEdge(parent || nodeById['subject:' + node.subject.key], node, parent ? 'part' : 'member');
    });
    // Prerequisite edges point from what is needed to what needs it.
    nodes.forEach(function (node) {
      if (node.type !== 'topic') return;
      node.topic.requires.forEach(function (id) { addEdge(nodeById[id], node, 'prereq'); });
    });
    nodes.forEach(function (node) {
      if (node.type !== 'topic') return;
      node.topic.related.forEach(function (id) { addEdge(nodeById[id], node, 'related'); });
    });

    // Neighbourhoods used for highlighting: a topic with everything it touches
    // and its subject; a subject with all of its topics.
    nodes.forEach(function (node) { node.near = {}; node.near[node.id] = true; });
    edges.forEach(function (edge) { edge.source.near[edge.target.id] = true; edge.target.near[edge.source.id] = true; });
    nodes.forEach(function (node) {
      if (node.type !== 'topic') return;
      var hub = nodeById['subject:' + node.subject.key];
      node.near[hub.id] = true;
      hub.near[node.id] = true;
    });

    // ── Layout ──
    function seedPositions() {
      nodes.forEach(function (node) { if (node.type === 'subject') node.home = hubHome(node.subject); });
      nodes.forEach(function (node) {
        node.vx = 0; node.vy = 0; node.vz = 0;
        if (node.type === 'subject') {
          node.x = node.home[0]; node.y = node.home[1]; node.z = node.home[2];
          return;
        }
        var hub = nodeById['subject:' + node.subject.key];
        var theta = randomFrom(node.id, 1) * Math.PI * 2;
        var phi = Math.acos(2 * randomFrom(node.id, 2) - 1);
        var distance = WORLD * (0.1 + randomFrom(node.id, 3) * 0.1);
        node.x = hub.home[0] + Math.cos(theta) * Math.sin(phi) * distance;
        node.y = hub.home[1] + Math.sin(theta) * Math.sin(phi) * distance * 0.78;
        node.z = hub.home[2] + Math.cos(phi) * distance;
      });
    }

    var dragNode = null;
    function simulate() {
      var index, other;
      for (index = 0; index < nodes.length; index += 1) {
        for (other = index + 1; other < nodes.length; other += 1) {
          var first = nodes[index];
          var second = nodes[other];
          var dx = second.x - first.x;
          var dy = second.y - first.y;
          var dz = second.z - first.z;
          var distanceSquared = Math.max(90, dx * dx + dy * dy + dz * dz);
          var distance = Math.sqrt(distanceSquared);
          var force = (first.type === 'subject' || second.type === 'subject' ? 360 : 280) / distanceSquared;
          dx /= distance; dy /= distance; dz /= distance;
          if (first !== dragNode) { first.vx -= dx * force; first.vy -= dy * force; first.vz -= dz * force; }
          if (second !== dragNode) { second.vx += dx * force; second.vy += dy * force; second.vz += dz * force; }
        }
      }

      edges.forEach(function (edge) {
        var sameSubject = edge.source.subject === edge.target.subject;
        var target;
        var strength;
        if (edge.type === 'member') { target = scope && !edge.target.external ? 0.24 : 0.19; strength = 1; }
        else if (edge.type === 'part') { target = 0.09; strength = 1; }
        else if (edge.type === 'prereq') { target = sameSubject ? 0.15 : 0.3; strength = sameSubject ? 0.4 : 0.12; }
        else { target = 0.22; strength = 0.08; }
        var dx = edge.target.x - edge.source.x;
        var dy = edge.target.y - edge.source.y;
        var dz = edge.target.z - edge.source.z;
        var distance = Math.max(1, Math.hypot(dx, dy, dz));
        var force = (distance - target * WORLD) * 0.0016 * strength;
        var fx = dx / distance * force;
        var fy = dy / distance * force;
        var fz = dz / distance * force;
        if (edge.source !== dragNode) { edge.source.vx += fx; edge.source.vy += fy; edge.source.vz += fz; }
        if (edge.target !== dragNode) { edge.target.vx -= fx; edge.target.vy -= fy; edge.target.vz -= fz; }
      });

      // Subjects hold their place; topics are drawn gently towards their subject.
      nodes.forEach(function (node) {
        var home = node.type === 'subject' ? node.home : nodeById['subject:' + node.subject.key].home;
        // On a subject page its own topics are held closer, against the pull of
        // their many prerequisites in other subjects.
        var pull = node.type === 'subject' ? 0.0006 : scope && !node.external ? 0.0016 : 0.0007;
        node.vx += (home[0] - node.x) * pull;
        node.vy += (home[1] - node.y) * pull;
        node.vz += (home[2] - node.z) * pull;
      });

      var radialLimit = WORLD * 0.46;
      nodes.forEach(function (node) {
        if (node === dragNode) return;
        node.vx *= 0.9; node.vy *= 0.9; node.vz *= 0.9;
        node.x += clamp(node.vx, -3, 3);
        node.y += clamp(node.vy, -3, 3);
        node.z += clamp(node.vz, -3, 3);
        var radius = Math.hypot(node.x / shape.x, node.y / shape.y, node.z);
        if (radius > radialLimit) {
          var shrink = radialLimit / radius;
          node.x *= shrink; node.y *= shrink; node.z *= shrink;
        }
      });
    }

    var settled = [];
    var middle = { x: 0, y: 0, z: 0 }; // centre of the settled layout, where the view rests
    function settle() {
      dragNode = null;
      seedPositions();
      for (var step = 0; step < SETTLE_STEPS; step += 1) simulate();
      settled = nodes.map(function (node) { return [node.x, node.y, node.z]; });
      var low = [Infinity, Infinity, Infinity];
      var high = [-Infinity, -Infinity, -Infinity];
      settled.forEach(function (point) {
        for (var axis = 0; axis < 3; axis += 1) {
          low[axis] = Math.min(low[axis], point[axis]);
          high[axis] = Math.max(high[axis], point[axis]);
        }
      });
      middle = { x: (low[0] + high[0]) / 2, y: (low[1] + high[1]) / 2, z: (low[2] + high[2]) / 2 };
    }
    function rest() {
      return { x: middle.x, y: middle.y, z: middle.z };
    }
    function restoreLayout() {
      nodes.forEach(function (node, index) {
        node.x = settled[index][0]; node.y = settled[index][1]; node.z = settled[index][2];
        node.vx = 0; node.vy = 0; node.vz = 0;
      });
    }

    // ── View ──
    var width = 0;
    var height = 0;
    var space = 1;
    var fit = 1;
    var zoom = 1;
    var view = { zoom: 1 }; // eased zoom target
    var zoomBeforeSubject = null;
    var yaw = YAW;
    var pitch = PITCH;
    var spinYaw = 0;
    var spinPitch = 0;
    var look = { x: 0, y: 0, z: 0 };
    var lookTarget = { x: 0, y: 0, z: 0 };
    var centre = { x: 0, y: 0 };
    var centreTarget = { x: 0, y: 0 };
    var simFrames = 0;
    var hovered = null;
    var keyFocus = null;
    var selected = null;
    var frame = null;

    function clampView() {
      var clampedYaw = clamp(yaw, -0.9, 0.9);
      var clampedPitch = clamp(pitch, -0.5, 0.5);
      if (clampedYaw !== yaw) spinYaw = 0;
      if (clampedPitch !== pitch) spinPitch = 0;
      yaw = clampedYaw;
      pitch = clampedPitch;
    }

    function rotatePoint(x, y, z) {
      var cosYaw = Math.cos(yaw);
      var sinYaw = Math.sin(yaw);
      var cosPitch = Math.cos(pitch);
      var sinPitch = Math.sin(pitch);
      var yawX = x * cosYaw + z * sinYaw;
      var yawZ = -x * sinYaw + z * cosYaw;
      return { x: yawX, y: y * cosPitch - yawZ * sinPitch, z: y * sinPitch + yawZ * cosPitch };
    }

    function project(node) {
      var rotated = rotatePoint(node.x - look.x, node.y - look.y, node.z - look.z);
      var camera = WORLD * 4;
      var perspective = camera / Math.max(camera * 0.45, camera - rotated.z);
      var unit = space / WORLD * fit * zoom * perspective;
      return { x: centre.x + rotated.x * unit, y: centre.y + rotated.y * unit, scale: perspective, unit: unit, depth: rotated.z };
    }

    // Scale the settled network so that, in the default view, it fills the
    // stage with room for labels at the edges. On a subject page the subject's
    // own topics get that room; neighbouring subjects only need to stay inside.
    function fitToStage() {
      var saved = { yaw: yaw, pitch: pitch, zoom: zoom, look: look, centre: centre };
      yaw = YAW; pitch = PITCH; zoom = 1; fit = 1;
      look = rest();
      centre = { x: 0, y: 0 };
      var own = { x: 1, y: 1 };
      var all = { x: 1, y: 1 };
      nodes.forEach(function (node) {
        var position = project(node);
        all.x = Math.max(all.x, Math.abs(position.x));
        all.y = Math.max(all.y, Math.abs(position.y));
        if (node.external) return;
        own.x = Math.max(own.x, Math.abs(position.x));
        own.y = Math.max(own.y, Math.abs(position.y));
      });
      var padX = Math.min(70, width * 0.11);
      var padY = Math.min(46, height * 0.08);
      fit = Math.min(
        (width / 2 - padX) / own.x, (height / 2 - padY) / own.y,
        (width / 2 - padX / 3) / all.x, (height / 2 - padY * 0.8) / all.y
      );
      fit = clamp(fit, 0.55, 1.8);
      yaw = saved.yaw; pitch = saved.pitch; zoom = saved.zoom; look = saved.look; centre = saved.centre;
    }

    function nodeRadius(node, position) {
      return node.radius * position.scale * zoom * clamp(space / 520, 0.8, 1.1);
    }

    function focusNode() {
      return hovered || keyFocus || selected;
    }

    function requestFrame() {
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    function ease(current, target) {
      var moving = false;
      Object.keys(target).forEach(function (key) {
        var delta = target[key] - current[key];
        if (Math.abs(delta) > (key === 'zoom' ? 0.002 : 0.05) && !reducedMotion) { current[key] += delta * 0.14; moving = true; }
        else current[key] = target[key];
      });
      return moving;
    }

    function tick() {
      frame = null;
      var moving = false;
      if (simFrames > 0) { simulate(); simFrames -= 1; moving = true; }
      if (!press && (Math.abs(spinYaw) > 0.0003 || Math.abs(spinPitch) > 0.0003)) {
        yaw += spinYaw;
        pitch += spinPitch;
        spinYaw *= 0.92;
        spinPitch *= 0.92;
        clampView();
        moving = true;
      }
      if (ease(look, lookTarget)) moving = true;
      var zoomState = { zoom: zoom };
      if (ease(zoomState, view)) moving = true;
      zoom = zoomState.zoom;
      if (ease(centre, centreTarget)) moving = true;
      draw();
      if (keyFocus) placeTooltip(keyFocus);
      if (moving) requestFrame();
    }

    // ── Drawing ──
    function edgeActive(edge, focus) {
      if (!focus) return null;
      if (edge.source === focus || edge.target === focus) return true;
      if (focus.type === 'subject') return edge.source.subject === focus.subject && edge.target.subject === focus.subject;
      return false;
    }

    function drawArrow(from, to, offset, colour) {
      var angle = Math.atan2(to.y - from.y, to.x - from.x);
      var tipX = to.x - Math.cos(angle) * (offset + 2);
      var tipY = to.y - Math.sin(angle) * (offset + 2);
      var size = 6;
      context.beginPath();
      context.moveTo(tipX, tipY);
      context.lineTo(tipX - Math.cos(angle - 0.42) * size, tipY - Math.sin(angle - 0.42) * size);
      context.lineTo(tipX - Math.cos(angle + 0.42) * size, tipY - Math.sin(angle + 0.42) * size);
      context.closePath();
      context.fillStyle = colour;
      context.fill();
    }

    function drawEdge(edge, positions, focus) {
      var source = positions[edge.source.id];
      var target = positions[edge.target.id];
      var style = EDGE_STYLE[edge.type];
      var active = edgeActive(edge, focus);
      var alpha = active === null ? style.alpha : active ? style.near : 0.035;
      if (active === null && edge.type === 'prereq' && edge.source.subject !== edge.target.subject) alpha *= 0.5;
      if (!active && (edge.source.external || edge.target.external)) alpha *= 0.6;
      var colour = edge.type === 'member' || edge.type === 'part'
        ? hexToRgba(edge.source.color, alpha)
        : 'rgba(' + INK + ',' + alpha + ')';
      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      context.setLineDash(style.dash || []);
      context.strokeStyle = colour;
      context.lineWidth = active ? style.width + 0.6 : style.width;
      context.stroke();
      context.setLineDash([]);
      if (active && edge.type === 'prereq') drawArrow(source, target, nodeRadius(edge.target, target), colour);
    }

    function drawNode(node, position, focus) {
      var near = focus && focus.near[node.id];
      var dimmed = focus && !near;
      var radius = nodeRadius(node, position);
      var depthAlpha = clamp(0.78 + position.depth / WORLD * 0.32, 0.5, 1);
      var alpha = dimmed ? 0.12 : depthAlpha;
      if (node.external && !near) alpha *= 0.62;
      var active = node === hovered || node === selected || node === keyFocus;

      context.save();
      context.globalAlpha = alpha;
      if (node === selected) {
        context.beginPath();
        context.arc(position.x, position.y, radius + 7, 0, Math.PI * 2);
        context.fillStyle = hexToRgba(node.color, 0.2);
        context.fill();
      }
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, Math.PI * 2);
      if (node.type === 'topic' && node.planned) {
        context.fillStyle = STAGE;
        context.fill();
        context.strokeStyle = active ? 'rgb(' + INK + ')' : node.color;
        context.lineWidth = active ? 2 : 1.6;
      } else {
        context.fillStyle = node.color;
        context.fill();
        context.strokeStyle = active ? 'rgb(' + INK + ')' : node.type === 'subject' ? 'rgba(255,255,255,.92)' : 'rgba(' + INK + ',.28)';
        context.lineWidth = active ? 2 : node.type === 'subject' ? 1.5 : 0.7;
      }
      context.stroke();
      if (node === keyFocus) {
        context.beginPath();
        context.arc(position.x, position.y, radius + 5, 0, Math.PI * 2);
        context.setLineDash([3, 3]);
        context.strokeStyle = 'rgb(' + INK + ')';
        context.lineWidth = 1.2;
        context.stroke();
        context.setLineDash([]);
      }
      context.restore();
    }

    var lineCache = {};
    function labelLines(title, font, max) {
      var key = font + '|' + max + '|' + title;
      if (lineCache[key]) return lineCache[key];
      var lines = [title];
      if (context.measureText(title).width > max && title.indexOf(' ') !== -1) {
        var words = title.split(' ');
        var best = null;
        for (var split = 1; split < words.length; split += 1) {
          var first = words.slice(0, split).join(' ');
          var second = words.slice(split).join(' ');
          var widest = Math.max(context.measureText(first).width, context.measureText(second).width);
          if (!best || widest < best.widest) best = { lines: [first, second], widest: widest };
        }
        lines = best.lines;
      }
      lineCache[key] = lines;
      return lines;
    }

    function overlaps(box, placed) {
      return placed.some(function (other) {
        return box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top;
      });
    }

    // Labels in priority order, skipping any that would overlap one already
    // drawn. With a focus: the focused node, then its neighbours, then the
    // other subjects. Without one: the subjects, then (when there is room)
    // topics with lessons and planned topics.
    function drawLabels(positions, focus) {
      var showTopics = Boolean(scope) || width * zoom >= 820;
      var candidates = [];
      nodes.forEach(function (node) {
        var near = focus && focus.near[node.id];
        var tier;
        if (focus) {
          if (node === focus) tier = 0;
          else if (near) tier = 1;
          else if (node.type === 'subject') tier = 2;
          else return;
        } else if (node.type === 'subject') tier = 0;
        else if (showTopics) tier = node.planned ? 4 : 3;
        else return;
        candidates.push({ node: node, position: positions[node.id], tier: tier, dimmed: focus && !near });
      });
      candidates.sort(function (first, second) {
        return first.tier - second.tier
          || (first.node.type === 'subject') - (second.node.type === 'subject')
          || second.position.depth - first.position.depth;
      });

      var placed = [];
      var narrow = width < 480;
      context.save();
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.lineJoin = 'round';
      candidates.forEach(function (candidate) {
        var node = candidate.node;
        var strong = node.type === 'subject' || node === focus;
        var size = node.type === 'subject' ? (narrow ? 10 : 11) : node === focus ? (narrow ? 10.5 : 11) : (narrow ? 9.5 : 10);
        var font = (strong ? 700 : 600) + ' ' + size + 'px Inter, sans-serif';
        context.font = font;
        var lines = labelLines(node.title, font, narrow ? 104 : 132);
        var lineHeight = size + 3;
        var labelWidth = Math.max.apply(null, lines.map(function (line) { return context.measureText(line).width; }));
        var x = clamp(candidate.position.x, labelWidth / 2 + 6, width - labelWidth / 2 - 6);
        var y = candidate.position.y + nodeRadius(node, candidate.position) + 5;
        var box = { left: x - labelWidth / 2 - 4, right: x + labelWidth / 2 + 4, top: y - 3, bottom: y + lines.length * lineHeight + 2 };
        if (candidate.tier > 0 && overlaps(box, placed)) return;
        placed.push(box);
        var alpha = candidate.dimmed ? 0.3 : node.external ? 0.62 : candidate.tier >= 3 ? 0.74 : 1;
        context.globalAlpha = alpha;
        lines.forEach(function (line, index) {
          var lineY = y + index * lineHeight;
          context.strokeStyle = 'rgba(246,243,236,.92)';
          context.lineWidth = 3;
          context.strokeText(line, x, lineY);
          context.fillStyle = 'rgb(' + INK + ')';
          context.fillText(line, x, lineY);
        });
      });
      context.restore();
    }

    function drawAxes() {
      var origin = { x: 28, y: height - 27 };
      var length = 23;
      var axes = [
        { label: 'X', color: '#c3a51f', vector: rotatePoint(length, 0, 0) },
        { label: 'Y', color: '#4b9a7f', vector: rotatePoint(0, -length, 0) },
        { label: 'Z', color: '#7660b5', vector: rotatePoint(0, 0, length) }
      ];
      context.save();
      context.font = '700 8px Inter, sans-serif';
      axes.forEach(function (axis) {
        var endX = origin.x + axis.vector.x;
        var endY = origin.y + axis.vector.y;
        context.beginPath();
        context.moveTo(origin.x, origin.y);
        context.lineTo(endX, endY);
        context.strokeStyle = axis.color;
        context.lineWidth = 1.2;
        context.stroke();
        context.fillStyle = axis.color;
        context.fillText(axis.label, endX + 3, endY + 3);
      });
      context.restore();
    }

    var positions = {};
    function draw() {
      var focus = focusNode();
      positions = {};
      nodes.forEach(function (node) { positions[node.id] = project(node); });
      context.clearRect(0, 0, width, height);
      ['member', 'part', 'related', 'prereq'].forEach(function (type) {
        edges.forEach(function (edge) { if (edge.type === type) drawEdge(edge, positions, focus); });
      });
      nodes
        .slice()
        .sort(function (first, second) { return positions[first.id].depth - positions[second.id].depth; })
        .forEach(function (node) { drawNode(node, positions[node.id], focus); });
      drawLabels(positions, focus);
      drawAxes();
    }

    // ── Tooltip ──
    function statusText(node) {
      if (node.type === 'subject') return text.subject;
      return node.subject.title + ' · ' + (node.planned ? text.planned : text.withLessons);
    }

    function showTooltip(node, point) {
      if (!tooltip) return;
      if (!node) { tooltip.hidden = true; return; }
      tooltip.innerHTML = '';
      tooltip.appendChild(html('strong', '', node.title));
      tooltip.appendChild(html('span', '', statusText(node)));
      tooltip.appendChild(html('em', '', node.type === 'subject' ? text.selectSubject : text.selectTopic));
      tooltip.hidden = false;
      var left = Math.min(width - 232, Math.max(12, point.x + 16));
      var top = Math.min(height - 108, Math.max(12, point.y + 16));
      tooltip.style.transform = 'translate(' + left + 'px, ' + top + 'px)';
    }

    function placeTooltip(node) {
      var position = positions[node.id] || project(node);
      showTooltip(node, { x: position.x, y: position.y });
    }

    // ── Detail panel ──
    function chips(title, ids, container) {
      if (!ids.length) return;
      container.appendChild(html('h4', '', title));
      var list = html('div', 'kg-chips');
      ids.forEach(function (id) {
        var node = nodeById[id];
        var topic = topicById[id];
        var subject = node ? node.subject : subjectByKey[topic.subject];
        var chip;
        if (node) {
          chip = html('button', 'kg-chip', node.title);
          chip.type = 'button';
          chip.addEventListener('click', function () { select(node); });
        } else {
          chip = html('a', 'kg-chip', topic.title);
          chip.href = subject.url;
        }
        chip.style.setProperty('--kg-color', subject.color);
        list.appendChild(chip);
      });
      container.appendChild(list);
    }

    function subjectLink(subject, container) {
      if (subject.key === scope) return;
      var link = html('a', 'kg-subject-link', text.openSubject + ' →');
      link.href = subject.url;
      container.appendChild(link);
    }

    function renderPanel(node) {
      var subject = node.subject;
      var body = html('div', 'kg-panel-body');
      var kicker = html('span', 'kg-panel-subject', subject.number + ' · ' + (node.type === 'subject' ? text.subject : subject.title));
      kicker.style.setProperty('--kg-color', subject.color);
      body.appendChild(kicker);
      body.appendChild(html('h3', '', node.title));

      if (node.type === 'subject') {
        body.appendChild(html('p', '', subject.summary));
        chips(text.topics, data.nodes.filter(function (topic) { return topic.subject === subject.key && nodeById[topic.id]; }).map(function (topic) { return topic.id; }), body);
        subjectLink(subject, body);
      } else {
        var topic = node.topic;
        body.appendChild(html('p', '', topic.summary));
        chips(text.partOf, topic.parent ? [topic.parent] : [], body);
        chips(text.prerequisites, topic.requires.filter(function (id) { return id !== topic.parent; }), body);
        chips(text.subtopics, topic.children, body);
        chips(text.leadsTo, topic.dependents.filter(function (id) { return topic.children.indexOf(id) === -1; }), body);
        chips(text.related, topic.relatedAll, body);

        body.appendChild(html('h4', '', text.lessons));
        if (topic.lessons.length) {
          var lessons = html('ul', 'kg-lessons');
          topic.lessons.forEach(function (lesson) {
            var item = html('li');
            var link = html('a', '', lesson.title);
            link.href = lesson.url;
            item.appendChild(link);
            var meta = html('span', 'kg-lesson-meta');
            meta.appendChild(html('span', 'academy-lesson-type', lesson.type));
            meta.appendChild(html('span', 'status-badge status-' + lesson.status, lesson.statusLabel));
            item.appendChild(meta);
            lessons.appendChild(item);
          });
          body.appendChild(lessons);
        } else {
          body.appendChild(html('p', 'kg-planned-note', text.plannedNote));
        }
        if (topic.resources.length) {
          body.appendChild(html('h4', '', text.resources));
          var resources = html('ul', 'kg-resources');
          topic.resources.forEach(function (resource) {
            var item = html('li');
            var link = html('a', '', resource.label + (resource.url.indexOf('://') !== -1 ? ' ↗' : ' →'));
            link.href = resource.url;
            item.appendChild(link);
            resources.appendChild(item);
          });
          body.appendChild(resources);
        }
        subjectLink(subject, body);
      }
      panelBody.innerHTML = '';
      panelBody.appendChild(body);
    }

    // The free area beside (desktop) or above (bottom sheet) the open panel.
    function updateCentre() {
      var target = { x: width / 2, y: height / 2 };
      if (!panel.hidden) {
        var stageBox = stage.getBoundingClientRect();
        var box = panel.getBoundingClientRect();
        if (box.left - stageBox.left > width * 0.3) target.x = (box.left - stageBox.left) / 2;
        else target.y = Math.max(60, (box.top - stageBox.top) / 2);
      }
      centreTarget = target;
    }

    function select(node) {
      selected = node;
      showTooltip(null);
      renderPanel(node);
      panel.hidden = false;
      root.classList.add('has-panel');
      panel.scrollTop = 0;
      lookTarget = { x: node.x, y: node.y, z: node.z };
      // Subjects open closer so that their topics can be read.
      if (node.type === 'subject' && !scope && view.zoom < 1.4) {
        if (zoomBeforeSubject === null) zoomBeforeSubject = view.zoom;
        view.zoom = 1.4;
      }
      updateCentre();
      requestFrame();
    }

    function closePanel(returnFocus) {
      if (panel.hidden) return;
      var hadFocus = panel.contains(document.activeElement);
      panel.hidden = true;
      root.classList.remove('has-panel');
      selected = null;
      lookTarget = rest();
      if (zoomBeforeSubject !== null) { view.zoom = zoomBeforeSubject; zoomBeforeSubject = null; }
      updateCentre();
      requestFrame();
      if (returnFocus || hadFocus) canvas.focus();
    }

    function resetView() {
      zoom = 1;
      view.zoom = 1;
      zoomBeforeSubject = null;
      yaw = YAW;
      pitch = PITCH;
      spinYaw = 0;
      spinPitch = 0;
      simFrames = 0;
      restoreLayout();
      closePanel(false);
      lookTarget = rest();
      requestFrame();
    }

    function zoomBy(factor) {
      zoomBeforeSubject = null;
      view.zoom = clamp(view.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      if (reducedMotion) zoom = view.zoom;
      requestFrame();
    }

    // ── Pointer input ──
    var pointers = {};
    var press = null;
    var pinch = null;

    function local(event) {
      var rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function pointerDistance() {
      var points = Object.keys(pointers).map(function (id) { return pointers[id]; });
      return Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y));
    }

    function hitTest(point, coarse) {
      var ordered = nodes.slice().sort(function (first, second) { return positions[first.id].depth - positions[second.id].depth; });
      for (var index = ordered.length - 1; index >= 0; index -= 1) {
        var node = ordered[index];
        var position = positions[node.id];
        if (!position) continue;
        var reach = Math.max(coarse ? 16 : 10, nodeRadius(node, position) + 4);
        if (Math.hypot(point.x - position.x, point.y - position.y) <= reach) return node;
      }
      return null;
    }

    function setHovered(node, point) {
      if (node !== hovered) { hovered = node; requestFrame(); }
      canvas.classList.toggle('is-link', Boolean(node));
      showTooltip(node, point);
    }

    canvas.addEventListener('pointerdown', function (event) {
      var point = local(event);
      pointers[event.pointerId] = point;
      try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* pointer already released */ }
      if (Object.keys(pointers).length === 2) {
        pinch = { distance: pointerDistance(), zoom: view.zoom };
        zoomBeforeSubject = null;
        if (press) press.moved = true;
        dragNode = null;
        return;
      }
      press = { start: point, last: point, lastMove: 0, node: hitTest(point, event.pointerType !== 'mouse'), moved: false };
      dragNode = press.node;
      spinYaw = 0;
      spinPitch = 0;
      canvas.classList.add('is-grabbing');
    });

    canvas.addEventListener('pointermove', function (event) {
      var point = local(event);
      if (pointers[event.pointerId]) pointers[event.pointerId] = point;
      if (pinch && Object.keys(pointers).length >= 2) {
        view.zoom = clamp(pinch.zoom * pointerDistance() / pinch.distance, MIN_ZOOM, MAX_ZOOM);
        zoom = view.zoom;
        requestFrame();
        return;
      }
      if (press) {
        var dx = point.x - press.last.x;
        var dy = point.y - press.last.y;
        if (Math.abs(point.x - press.start.x) + Math.abs(point.y - press.start.y) > 4) press.moved = true;
        if (press.moved) {
          if (dragNode) {
            var divisor = Math.max(0.2, (positions[dragNode.id] || project(dragNode)).unit);
            dragNode.x += dx * Math.cos(yaw) / divisor;
            dragNode.y += dy * Math.cos(pitch) / divisor;
            dragNode.z += (dx * Math.sin(yaw) - dy * Math.sin(pitch)) / divisor;
            dragNode.vx = 0; dragNode.vy = 0; dragNode.vz = 0;
            simFrames = 120;
            if (selected === dragNode) lookTarget = { x: dragNode.x, y: dragNode.y, z: dragNode.z };
          } else {
            yaw += dx * 0.008;
            pitch += dy * 0.006;
            spinYaw = dx * 0.008;
            spinPitch = dy * 0.006;
            clampView();
          }
          press.lastMove = event.timeStamp;
          showTooltip(null);
          requestFrame();
        }
        press.last = point;
        return;
      }
      if (event.pointerType === 'mouse') setHovered(hitTest(point, false), point);
    });

    function release(event) {
      delete pointers[event.pointerId];
      if (pinch) {
        if (Object.keys(pointers).length < 2) pinch = null;
        press = null;
        dragNode = null;
        canvas.classList.remove('is-grabbing');
        return;
      }
      if (!press) return;
      if (!press.moved && event.type === 'pointerup') {
        if (press.node) select(press.node);
        else closePanel(false);
      }
      if (reducedMotion || dragNode || !press.moved || event.timeStamp - press.lastMove > 90) { spinYaw = 0; spinPitch = 0; }
      press = null;
      dragNode = null;
      canvas.classList.remove('is-grabbing');
      requestFrame();
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', function (event) {
      if (!press && event.pointerType === 'mouse') setHovered(null);
    });
    // Plain scrolling keeps scrolling the page; pinch (Ctrl + wheel) and
    // Ctrl/⌘ + scroll zoom the graph.
    canvas.addEventListener('wheel', function (event) {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomBy(clamp(Math.exp(-event.deltaY * 0.01), 0.8, 1.25));
      zoom = view.zoom;
    }, { passive: false });

    canvas.addEventListener('keydown', function (event) {
      if (event.key === '+' || event.key === '=') zoomBy(1.12);
      else if (event.key === '-' || event.key === '_') zoomBy(0.88);
      else if (event.key === 'ArrowLeft') yaw -= 0.1;
      else if (event.key === 'ArrowRight') yaw += 0.1;
      else if (event.key === 'ArrowUp') pitch -= 0.08;
      else if (event.key === 'ArrowDown') pitch += 0.08;
      else if (event.key === '0') resetView();
      else if (event.key === 'Escape') { if (panel.hidden) resetView(); else closePanel(true); }
      else return;
      clampView();
      requestFrame();
      event.preventDefault();
    });

    root.querySelectorAll('[data-kg-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.getAttribute('data-kg-action');
        if (action === 'zoom-in') zoomBy(1.18);
        else if (action === 'zoom-out') zoomBy(0.82);
        else resetView();
      });
    });
    if (panelClose) panelClose.addEventListener('click', function () { closePanel(true); });
    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { event.stopPropagation(); closePanel(true); }
    });

    // ── Keyboard topic list: one tab stop, arrow keys move between nodes ──
    if (topicList) {
      var order = [];
      data.subjects.forEach(function (subject) {
        var hub = nodeById['subject:' + subject.key];
        if (!hub) return;
        order.push(hub);
        nodes.forEach(function (node) { if (node.type === 'topic' && node.subject === subject && !node.external) order.push(node); });
      });
      nodes.forEach(function (node) { if (node.type === 'topic' && node.external) order.push(node); });
      var buttons = order.map(function (node, index) {
        var item = html('li');
        var button = html('button', '', node.title + ', ' + statusText(node));
        button.type = 'button';
        button.tabIndex = index === 0 ? 0 : -1;
        button.addEventListener('focus', function () {
          buttons.forEach(function (other) { other.tabIndex = other === button ? 0 : -1; });
          keyFocus = node;
          stage.classList.add('is-keyboard');
          placeTooltip(node);
          requestFrame();
        });
        button.addEventListener('blur', function () {
          keyFocus = null;
          stage.classList.remove('is-keyboard');
          showTooltip(null);
          requestFrame();
        });
        button.addEventListener('click', function () { select(node); });
        button.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = buttons[(index + 1) % buttons.length];
          else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = buttons[(index - 1 + buttons.length) % buttons.length];
          else if (event.key === 'Home') next = buttons[0];
          else if (event.key === 'End') next = buttons[buttons.length - 1];
          else if (event.key === 'Escape' && !panel.hidden) { closePanel(false); event.preventDefault(); return; }
          if (!next) return;
          event.preventDefault();
          next.focus();
        });
        item.appendChild(button);
        topicList.appendChild(item);
        return button;
      });
    }

    // ── Size ──
    function resize() {
      var rect = stage.getBoundingClientRect();
      var nextWidth = Math.max(1, Math.round(rect.width));
      var nextHeight = Math.max(320, Math.round(rect.height));
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      space = Math.min(width, height);
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      lineCache = {};
      var aspect = width / height;
      var nextShape = { x: clamp(aspect, 1, 1.45), y: clamp(1 / aspect, 1, 1.25) };
      if (!settled.length || Math.abs(nextShape.x - shape.x) > 0.12 || Math.abs(nextShape.y - shape.y) > 0.12) {
        shape = nextShape;
        settle();
        lookTarget = selected ? { x: selected.x, y: selected.y, z: selected.z } : rest();
        look = { x: lookTarget.x, y: lookTarget.y, z: lookTarget.z };
      }
      fitToStage();
      updateCentre();
      centre = { x: centreTarget.x, y: centreTarget.y };
      draw();
    }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize', resize);
    resize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { lineCache = {}; requestFrame(); });
  }

  document.querySelectorAll('[data-knowledge-graph]').forEach(init);
}());
