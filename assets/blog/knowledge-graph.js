(function () {
  'use strict';

  const palette = {
    converter: '#e6c62e',
    device: '#5f8fe0',
    sst: '#8d70dc',
    wpt: '#3fb58e',
    updates: '#e8775f'
  };

  const topicPairs = [
    ['converter', 'device'],
    ['converter', 'sst'],
    ['converter', 'wpt'],
    ['device', 'sst'],
    ['sst', 'wpt'],
    ['updates', 'converter'],
    ['updates', 'device']
  ];

  const topicSeeds = {
    converter: [-0.38, -0.24, -0.16],
    device: [0.38, -0.25, 0.18],
    sst: [0.34, 0.28, -0.14],
    wpt: [-0.40, 0.28, 0.18],
    updates: [0, 0, 0]
  };

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function randomFrom(text, offset) {
    return (hash(`${text}:${offset}`) % 10000) / 10000;
  }

  function hexToRgba(hex, alpha) {
    const value = parseInt(hex.slice(1), 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }

  document.querySelectorAll('[data-blog-knowledge-map]').forEach((map) => {
    const canvas = map.querySelector('.blog-graph-canvas');
    const stage = map.querySelector('.blog-graph-stage');
    const tooltip = map.querySelector('.blog-graph-tooltip');
    const dataElement = map.querySelector('.blog-graph-data');
    if (!canvas || !stage || !dataElement) return;

    let data;
    try {
      data = JSON.parse(dataElement.textContent);
    } catch (error) {
      map.classList.add('is-unavailable');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let space = 0;
    let pixelRatio = 1;
    let nodes = [];
    let edges = [];
    let hovered = null;
    let selectedTopic = null;
    let pointer = null;
    let dragNode = null;
    let rotating = false;
    let moved = false;
    let lastPointer = { x: 0, y: 0 };
    let zoom = 1;
    let yaw = -0.26;
    let pitch = -0.14;
    let settledFrames = 0;

    function clampView() {
      yaw = Math.max(-0.74, Math.min(0.74, yaw));
      pitch = Math.max(-0.44, Math.min(0.44, pitch));
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function categoriesFor(post) {
      const list = Object.keys(palette).filter((key) => key !== 'updates' && post.series[key]);
      return list.length ? list : ['updates'];
    }

    function buildGraph() {
      nodes = [];
      edges = [];

      Object.keys(palette).forEach((key) => {
        const seed = topicSeeds[key];
        const x = seed[0] * space;
        const y = seed[1] * space;
        const z = seed[2] * space;
        nodes.push({
          id: `topic:${key}`,
          key,
          type: 'topic',
          title: data.topics[key],
          color: palette[key],
          x,
          y,
          z,
          homeX: x,
          homeY: y,
          homeZ: z,
          vx: 0,
          vy: 0,
          vz: 0,
          radius: 14
        });
      });

      data.posts.forEach((post, index) => {
        const categories = categoriesFor(post);
        const primary = categories[0];
        const anchor = topicSeeds[primary];
        const theta = randomFrom(post.id, 1) * Math.PI * 2;
        const phi = Math.acos(2 * randomFrom(post.id, 2) - 1);
        const distance = space * (0.09 + randomFrom(post.id, 3) * 0.10);
        const sinPhi = Math.sin(phi);
        nodes.push({
          id: `post:${post.id}`,
          postId: post.id,
          type: 'post',
          title: post.title,
          url: post.url,
          date: post.date,
          categories,
          color: palette[primary],
          x: anchor[0] * space + Math.cos(theta) * sinPhi * distance,
          y: anchor[1] * space + Math.sin(theta) * sinPhi * distance * 0.78,
          z: anchor[2] * space + Math.cos(phi) * distance,
          vx: 0,
          vy: 0,
          vz: 0,
          radius: 3.4 + randomFrom(post.id, 4) * 1.5,
          index
        });
      });

      const byId = new Map(nodes.map((node) => [node.id, node]));
      const edgeIds = new Set();
      const addEdge = (sourceId, targetId, type, color, strength) => {
        const source = byId.get(sourceId);
        const target = byId.get(targetId);
        if (!source || !target) return;
        const id = [sourceId, targetId].sort().join('|');
        if (edgeIds.has(id)) return;
        edgeIds.add(id);
        edges.push({ id, source, target, type, color, strength });
      };

      topicPairs.forEach(([source, target]) => {
        addEdge(`topic:${source}`, `topic:${target}`, 'topic', '#8e877b', 0.58);
      });

      const groups = {};
      Object.keys(palette).forEach((key) => { groups[key] = []; });

      nodes.filter((node) => node.type === 'post').forEach((node) => {
        node.categories.forEach((category) => {
          addEdge(`topic:${category}`, node.id, 'membership', palette[category], 1);
          groups[category].push(node);
        });
      });

      Object.keys(groups).forEach((category) => {
        groups[category]
          .sort((first, second) => first.date.localeCompare(second.date) || first.index - second.index)
          .forEach((node, index, group) => {
            if (index > 0) addEdge(group[index - 1].id, node.id, 'article', palette[category], 0.42);
          });
      });

      ['dab', 'thermal', 'cycling', 'reliability', 'boost', 'wireless', 'transformer', 'characterisation'].forEach((term) => {
        const matches = nodes.filter((node) => node.type === 'post' && node.postId.includes(term));
        matches.slice(1).forEach((node, index) => {
          addEdge(matches[index].id, node.id, 'article', '#8e877b', 0.34);
        });
      });
    }

    function resetView() {
      zoom = 1;
      yaw = -0.26;
      pitch = -0.14;
      selectedTopic = null;
      buildGraph();
      settledFrames = 0;
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(340, Math.round(rect.height));
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      space = Math.min(width, height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      resetView();
    }

    function linkedTo(node, other) {
      return edges.some((edge) => (edge.source === node && edge.target === other) || (edge.target === node && edge.source === other));
    }

    function focusNode() {
      return hovered || selectedTopic;
    }

    function isDimmed(node) {
      const focus = focusNode();
      return Boolean(focus && node !== focus && !linkedTo(focus, node));
    }

    function simulate() {
      if (reducedMotion || settledFrames > 360) return;
      const movable = nodes.filter((node) => node !== dragNode);

      for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
          const first = nodes[firstIndex];
          const second = nodes[secondIndex];
          let dx = second.x - first.x;
          let dy = second.y - first.y;
          let dz = second.z - first.z;
          const distanceSquared = Math.max(90, dx * dx + dy * dy + dz * dz);
          const distance = Math.sqrt(distanceSquared);
          const force = ((first.type === 'topic' || second.type === 'topic') ? 310 : 110) / distanceSquared;
          dx /= distance;
          dy /= distance;
          dz /= distance;
          if (first !== dragNode) {
            first.vx -= dx * force;
            first.vy -= dy * force;
            first.vz -= dz * force;
          }
          if (second !== dragNode) {
            second.vx += dx * force;
            second.vy += dy * force;
            second.vz += dz * force;
          }
        }
      }

      edges.forEach((edge) => {
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const dz = edge.target.z - edge.source.z;
        const distance = Math.max(1, Math.hypot(dx, dy, dz));
        const targetDistance = edge.type === 'topic' ? space * 0.42 : edge.type === 'membership' ? space * 0.18 : space * 0.11;
        const force = (distance - targetDistance) * (edge.type === 'topic' ? 0.0008 : 0.0016) * edge.strength;
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        const fz = dz / distance * force;
        if (edge.source !== dragNode) {
          edge.source.vx += fx;
          edge.source.vy += fy;
          edge.source.vz += fz;
        }
        if (edge.target !== dragNode) {
          edge.target.vx -= fx;
          edge.target.vy -= fy;
          edge.target.vz -= fz;
        }
      });

      nodes.filter((node) => node.type === 'topic').forEach((node) => {
        node.vx += (node.homeX - node.x) * 0.0005;
        node.vy += (node.homeY - node.y) * 0.0005;
        node.vz += (node.homeZ - node.z) * 0.0005;
      });

      const radialLimit = space * 0.42;
      movable.forEach((node) => {
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.vz *= 0.9;
        node.x += Math.max(-3, Math.min(3, node.vx));
        node.y += Math.max(-3, Math.min(3, node.vy));
        node.z += Math.max(-3, Math.min(3, node.vz));
        const radius = Math.hypot(node.x, node.y, node.z);
        if (radius > radialLimit) {
          const fit = radialLimit / radius;
          node.x *= fit;
          node.y *= fit;
          node.z *= fit;
        }
      });
      settledFrames += 1;
    }

    function rotatePoint(x, y, z) {
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const yawX = x * cosYaw + z * sinYaw;
      const yawZ = -x * sinYaw + z * cosYaw;
      return {
        x: yawX,
        y: y * cosPitch - yawZ * sinPitch,
        z: y * sinPitch + yawZ * cosPitch
      };
    }

    function screenPosition(node) {
      const rotated = rotatePoint(node.x, node.y, node.z);
      const camera = Math.max(640, space * 4);
      const perspective = camera / Math.max(camera * 0.45, camera - rotated.z);
      return {
        x: width * 0.5 + rotated.x * perspective * zoom,
        y: height * 0.5 + rotated.y * perspective * zoom,
        scale: perspective,
        depth: rotated.z
      };
    }

    function drawEdge(edge) {
      const source = screenPosition(edge.source);
      const target = screenPosition(edge.target);
      const focus = focusNode();
      const active = !focus || edge.source === focus || edge.target === focus;
      const baseAlpha = edge.type === 'topic' ? 0.28 : edge.type === 'membership' ? 0.22 : 0.11;
      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      context.strokeStyle = edge.color === '#8e877b'
        ? `rgba(102,94,80,${active ? baseAlpha : 0.035})`
        : hexToRgba(edge.color, active ? baseAlpha : 0.035);
      context.lineWidth = active && focus ? 1.25 : edge.type === 'topic' ? 1 : 0.65;
      context.stroke();
    }

    function drawNode(node) {
      const position = screenPosition(node);
      const dimmed = isDimmed(node);
      const radius = node.radius * position.scale * zoom;
      const active = node === hovered || node === selectedTopic;
      const labelWidth = width < 480 ? 112 : 148;
      const labelX = Math.max(labelWidth / 2 + 8, Math.min(width - labelWidth / 2 - 8, position.x));

      context.save();
      context.globalAlpha = dimmed ? 0.12 : Math.max(0.5, Math.min(1, 0.78 + position.depth / Math.max(space, 1) * 0.32));
      context.fillStyle = node.color;
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = active ? '#241c10' : node.type === 'topic' ? 'rgba(255,255,255,.92)' : 'rgba(36,28,16,.28)';
      context.lineWidth = active ? 2 : node.type === 'topic' ? 1.5 : 0.7;
      context.stroke();

      if (node.type === 'topic') {
        context.globalAlpha = dimmed ? 0.22 : 1;
        context.fillStyle = '#241c10';
        context.font = `700 ${width < 480 ? 10 : 11}px Inter, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(node.title, labelX, position.y + radius + 7, labelWidth);
      } else if (active && !dimmed) {
        context.fillStyle = '#241c10';
        context.font = '600 10px Inter, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(node.title, labelX, position.y + radius + 6, width < 480 ? 150 : 190);
      }
      context.restore();
    }

    function drawAxes() {
      const origin = { x: 28, y: height - 27 };
      const length = 23;
      const axes = [
        { label: 'X', color: '#c3a51f', vector: rotatePoint(length, 0, 0) },
        { label: 'Y', color: '#4b9a7f', vector: rotatePoint(0, -length, 0) },
        { label: 'Z', color: '#7660b5', vector: rotatePoint(0, 0, length) }
      ];
      context.save();
      context.font = '700 8px Inter, sans-serif';
      axes.forEach((axis) => {
        const endX = origin.x + axis.vector.x;
        const endY = origin.y + axis.vector.y;
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

    function draw() {
      context.clearRect(0, 0, width, height);
      edges.forEach(drawEdge);
      nodes
        .slice()
        .sort((first, second) => screenPosition(first).depth - screenPosition(second).depth)
        .forEach(drawNode);
      drawAxes();
    }

    function animate() {
      simulate();
      draw();
      window.requestAnimationFrame(animate);
    }

    function pointerCoordinates(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function hitTest(point) {
      const ordered = nodes.slice().sort((first, second) => screenPosition(first).depth - screenPosition(second).depth);
      for (let index = ordered.length - 1; index >= 0; index -= 1) {
        const node = ordered[index];
        const position = screenPosition(node);
        const radius = Math.max(10, node.radius * position.scale * zoom + 4);
        if (Math.hypot(point.x - position.x, point.y - position.y) <= radius) return node;
      }
      return null;
    }

    function updateTooltip(node, point) {
      if (!node) {
        tooltip.hidden = true;
        return;
      }
      const topicText = node.type === 'topic'
        ? (data.lang === 'zh' ? '技术主题 · 点击聚焦' : 'Engineering theme · select to focus')
        : node.categories.map((key) => data.topics[key]).join(' · ');
      tooltip.innerHTML = `<strong>${node.title}</strong><span>${topicText}</span>${node.type === 'post' ? `<em>${data.lang === 'zh' ? '点击阅读文章 →' : 'Select to read →'}</em>` : ''}`;
      tooltip.hidden = false;
      const left = Math.min(width - 230, Math.max(12, point.x + 16));
      const top = Math.min(height - 105, Math.max(12, point.y + 16));
      tooltip.style.transform = `translate(${left}px, ${top}px)`;
    }

    function zoomBy(factor) {
      zoom = Math.max(0.68, Math.min(2.1, zoom * factor));
    }

    canvas.addEventListener('pointerdown', (event) => {
      pointer = pointerCoordinates(event);
      lastPointer = pointer;
      dragNode = hitTest(pointer);
      rotating = !dragNode;
      moved = false;
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add('is-grabbing');
      settledFrames = 0;
    });

    canvas.addEventListener('pointermove', (event) => {
      const point = pointerCoordinates(event);
      if (pointer) {
        const dx = point.x - lastPointer.x;
        const dy = point.y - lastPointer.y;
        if (Math.abs(point.x - pointer.x) + Math.abs(point.y - pointer.y) > 4) moved = true;
        if (dragNode) {
          const position = screenPosition(dragNode);
          const divisor = Math.max(0.45, position.scale * zoom);
          dragNode.x += (dx * Math.cos(yaw)) / divisor;
          dragNode.y += (dy * Math.cos(pitch)) / divisor;
          dragNode.z += (dx * Math.sin(yaw) - dy * Math.sin(pitch)) / divisor;
          dragNode.vx = 0;
          dragNode.vy = 0;
          dragNode.vz = 0;
        } else if (rotating) {
          yaw += dx * 0.008;
          pitch += dy * 0.006;
          clampView();
        }
        lastPointer = point;
        return;
      }
      hovered = hitTest(point);
      canvas.classList.toggle('is-link', Boolean(hovered && hovered.type === 'post'));
      updateTooltip(hovered, point);
    });

    function releasePointer(event) {
      if (!pointer) return;
      const point = pointerCoordinates(event);
      const releasedNode = dragNode || hitTest(point);
      if (!moved && releasedNode) {
        if (releasedNode.type === 'post') window.location.href = releasedNode.url;
        else selectedTopic = selectedTopic === releasedNode ? null : releasedNode;
      }
      pointer = null;
      dragNode = null;
      rotating = false;
      canvas.classList.remove('is-grabbing');
    }

    canvas.addEventListener('pointerup', releasePointer);
    canvas.addEventListener('pointercancel', releasePointer);
    canvas.addEventListener('pointerleave', () => {
      if (!pointer) {
        hovered = null;
        updateTooltip(null);
      }
    });
    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 1.1 : 0.9);
    }, { passive: false });
    canvas.addEventListener('keydown', (event) => {
      if (event.key === '+' || event.key === '=') zoomBy(1.12);
      else if (event.key === '-' || event.key === '_') zoomBy(0.88);
      else if (event.key === 'ArrowLeft') yaw -= 0.1;
      else if (event.key === 'ArrowRight') yaw += 0.1;
      else if (event.key === 'ArrowUp') pitch -= 0.08;
      else if (event.key === 'ArrowDown') pitch += 0.08;
      else if (event.key === 'Escape' || event.key === '0') resetView();
      else return;
      clampView();
      event.preventDefault();
    });

    map.querySelectorAll('[data-graph-action]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.graphAction === 'zoom-in') zoomBy(1.18);
        else if (button.dataset.graphAction === 'zoom-out') zoomBy(0.82);
        else resetView();
      });
    });

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();
    window.requestAnimationFrame(animate);
  });
}());
