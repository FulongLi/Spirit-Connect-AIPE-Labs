(function () {
  'use strict';

  const palette = {
    converter: '#f5d54a',
    device: '#78a7ff',
    sst: '#a88cff',
    wpt: '#58cfaa',
    updates: '#ff8e72'
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
    converter: [0.28, 0.28],
    device: [0.73, 0.24],
    sst: [0.62, 0.69],
    wpt: [0.22, 0.72],
    updates: [0.50, 0.46]
  };

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function randomFrom(text, offset) {
    const value = hash(text + ':' + offset);
    return (value % 10000) / 10000;
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
    let pixelRatio = 1;
    let nodes = [];
    let edges = [];
    let stars = [];
    let hovered = null;
    let selectedTopic = null;
    let pointer = null;
    let dragNode = null;
    let panning = false;
    let moved = false;
    let lastPointer = { x: 0, y: 0 };
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let settledFrames = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function categoriesFor(post) {
      const list = Object.keys(palette).filter((key) => key !== 'updates' && post.series[key]);
      return list.length ? list : ['updates'];
    }

    function buildGraph() {
      nodes = [];
      edges = [];

      Object.keys(palette).forEach((key, index) => {
        const seed = topicSeeds[key];
        const topicMargin = width < 480 ? Math.min(82, width * 0.27) : 54;
        const homeX = Math.max(topicMargin, Math.min(width - topicMargin, seed[0] * width));
        nodes.push({
          id: `topic:${key}`,
          key,
          type: 'topic',
          title: data.topics[key],
          color: palette[key],
          x: homeX,
          y: seed[1] * height,
          homeX,
          homeY: seed[1] * height,
          vx: 0,
          vy: 0,
          z: 0.34 + index * 0.035,
          radius: 31
        });
      });

      data.posts.forEach((post, index) => {
        const categories = categoriesFor(post);
        const primary = categories[0];
        const anchor = topicSeeds[primary];
        const angle = randomFrom(post.id, 1) * Math.PI * 2;
        const distance = 72 + randomFrom(post.id, 2) * 118;
        nodes.push({
          id: `post:${post.id}`,
          postId: post.id,
          type: 'post',
          title: post.title,
          url: post.url,
          date: post.date,
          categories,
          color: palette[primary],
          x: anchor[0] * width + Math.cos(angle) * distance,
          y: anchor[1] * height + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          z: -0.22 + randomFrom(post.id, 3) * 0.62,
          phase: randomFrom(post.id, 4) * Math.PI * 2,
          radius: 5.5 + randomFrom(post.id, 5) * 2.8,
          index
        });
      });

      const byId = new Map(nodes.map((node) => [node.id, node]));
      const addEdge = (sourceId, targetId, type, color, strength) => {
        const source = byId.get(sourceId);
        const target = byId.get(targetId);
        if (!source || !target) return;
        const edgeId = [sourceId, targetId].sort().join('|');
        if (edges.some((edge) => edge.id === edgeId)) return;
        edges.push({ id: edgeId, source, target, type, color, strength });
      };

      topicPairs.forEach(([source, target]) => {
        addEdge(`topic:${source}`, `topic:${target}`, 'topic', '#ffffff', 0.6);
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
          .sort((a, b) => a.date.localeCompare(b.date) || a.index - b.index)
          .forEach((node, index, group) => {
            if (index > 0) addEdge(group[index - 1].id, node.id, 'article', palette[category], 0.48);
          });
      });

      const clusters = ['dab', 'thermal', 'cycling', 'reliability', 'boost', 'wireless', 'transformer', 'characterisation'];
      clusters.forEach((term) => {
        const matches = nodes.filter((node) => node.type === 'post' && node.postId.includes(term));
        matches.slice(1).forEach((node, index) => {
          addEdge(matches[index].id, node.id, 'article', '#ffffff', 0.38);
        });
      });
    }

    function resetView() {
      zoom = 1;
      panX = 0;
      panY = 0;
      selectedTopic = null;
      buildGraph();
      settledFrames = 0;
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(430, Math.round(rect.height));
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = Array.from({ length: Math.round(width * height / 11500) }, (_, index) => ({
        x: randomFrom('star', index * 2) * width,
        y: randomFrom('star', index * 2 + 1) * height,
        r: 0.35 + randomFrom('star-radius', index) * 1.1
      }));
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
      if (!focus) return false;
      return node !== focus && !linkedTo(focus, node);
    }

    function simulate() {
      if (reducedMotion || settledFrames > 420) return;
      const movable = nodes.filter((node) => node !== dragNode);

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const first = nodes[i];
          const second = nodes[j];
          let dx = second.x - first.x;
          let dy = second.y - first.y;
          const distanceSquared = Math.max(120, dx * dx + dy * dy);
          const distance = Math.sqrt(distanceSquared);
          const force = ((first.type === 'topic' || second.type === 'topic') ? 500 : 165) / distanceSquared;
          dx /= distance;
          dy /= distance;
          if (first !== dragNode) { first.vx -= dx * force; first.vy -= dy * force; }
          if (second !== dragNode) { second.vx += dx * force; second.vy += dy * force; }
        }
      }

      edges.forEach((edge) => {
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const targetDistance = edge.type === 'topic' ? Math.min(width, height) * 0.36 : edge.type === 'membership' ? 105 : 62;
        const force = (distance - targetDistance) * (edge.type === 'topic' ? 0.0009 : 0.0018) * edge.strength;
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        if (edge.source !== dragNode) { edge.source.vx += fx; edge.source.vy += fy; }
        if (edge.target !== dragNode) { edge.target.vx -= fx; edge.target.vy -= fy; }
      });

      nodes.filter((node) => node.type === 'topic').forEach((node) => {
        node.vx += (node.homeX - node.x) * 0.00045;
        node.vy += (node.homeY - node.y) * 0.00045;
      });

      movable.forEach((node) => {
        node.vx += (width * 0.5 - node.x) * 0.00003;
        node.vy += (height * 0.5 - node.y) * 0.00003;
        node.vx *= 0.91;
        node.vy *= 0.91;
        node.x += Math.max(-3.5, Math.min(3.5, node.vx));
        node.y += Math.max(-3.5, Math.min(3.5, node.vy));
        const margin = node.type === 'topic' ? (width < 480 ? Math.min(82, width * 0.27) : 54) : 18;
        node.x = Math.max(margin, Math.min(width - margin, node.x));
        node.y = Math.max(margin, Math.min(height - margin, node.y));
      });
      settledFrames += 1;
    }

    function screenPosition(node, time) {
      const float = reducedMotion || node.type === 'topic' ? 0 : Math.sin(time * 0.00055 + node.phase) * 2.2;
      return {
        x: node.x * zoom + panX + node.z * 8,
        y: (node.y + float) * zoom + panY - node.z * 5,
        scale: Math.max(0.75, 1 + node.z * 0.22)
      };
    }

    function drawEdge(edge, time) {
      const source = screenPosition(edge.source, time);
      const target = screenPosition(edge.target, time);
      const focus = focusNode();
      const active = !focus || edge.source === focus || edge.target === focus;
      const alpha = active ? (edge.type === 'topic' ? 0.2 : edge.type === 'membership' ? 0.25 : 0.11) : 0.025;
      context.beginPath();
      context.moveTo(source.x, source.y);
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      const curve = edge.type === 'topic' ? 18 : 6;
      context.quadraticCurveTo(midX + (target.y - source.y) / Math.max(8, curve), midY - (target.x - source.x) / Math.max(8, curve), target.x, target.y);
      context.strokeStyle = edge.color === '#ffffff' ? `rgba(255,255,255,${alpha})` : hexToRgba(edge.color, alpha);
      context.lineWidth = active && focus ? 1.35 : edge.type === 'topic' ? 1.1 : 0.7;
      context.stroke();
    }

    function drawNode(node, time) {
      const position = screenPosition(node, time);
      const dimmed = isDimmed(node);
      const radius = node.radius * position.scale * zoom;
      const active = node === hovered || node === selectedTopic;
      context.save();
      context.globalAlpha = dimmed ? 0.16 : 1;
      context.shadowColor = hexToRgba(node.color, active ? 0.9 : node.type === 'topic' ? 0.55 : 0.36);
      context.shadowBlur = active ? 26 : node.type === 'topic' ? 19 : 10;
      const gradient = context.createRadialGradient(position.x - radius * 0.34, position.y - radius * 0.38, radius * 0.08, position.x, position.y, radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.17, node.color);
      gradient.addColorStop(1, node.type === 'topic' ? hexToRgba(node.color, 0.54) : hexToRgba(node.color, 0.38));
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = active ? '#ffffff' : hexToRgba(node.color, node.type === 'topic' ? 0.72 : 0.48);
      context.lineWidth = active ? 1.8 : 0.8;
      context.stroke();

      if (node.type === 'topic') {
        context.fillStyle = dimmed ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.94)';
        context.font = `700 ${Math.max(10, (width < 480 ? 11 : 13) * zoom)}px Inter, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(node.title, position.x, position.y + radius + 11, (width < 480 ? 126 : 150) * zoom);
      } else if ((active || zoom > 1.42) && !dimmed) {
        context.fillStyle = 'rgba(255,255,255,.9)';
        context.font = `600 ${Math.max(9, 10 * zoom)}px Inter, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(node.title, position.x, position.y + radius + 7, 185 * zoom);
      }
      context.restore();
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        context.beginPath();
        context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255,255,255,.14)';
        context.fill();
      });
      edges.forEach((edge) => drawEdge(edge, time));
      nodes.filter((node) => node.type === 'post').sort((a, b) => a.z - b.z).forEach((node) => drawNode(node, time));
      nodes.filter((node) => node.type === 'topic').forEach((node) => drawNode(node, time));
    }

    function animate(time) {
      simulate();
      draw(time);
      window.requestAnimationFrame(animate);
    }

    function pointerCoordinates(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function hitTest(point, time) {
      const ordered = nodes.slice().sort((a, b) => (a.type === 'topic' ? 1 : 0) - (b.type === 'topic' ? 1 : 0));
      for (let index = ordered.length - 1; index >= 0; index -= 1) {
        const node = ordered[index];
        const position = screenPosition(node, time || performance.now());
        const radius = Math.max(12, node.radius * position.scale * zoom + 5);
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

    function zoomAt(factor, point) {
      const nextZoom = Math.max(0.62, Math.min(2.35, zoom * factor));
      const anchor = point || { x: width / 2, y: height / 2 };
      panX = anchor.x - (anchor.x - panX) * (nextZoom / zoom);
      panY = anchor.y - (anchor.y - panY) * (nextZoom / zoom);
      zoom = nextZoom;
    }

    canvas.addEventListener('pointerdown', (event) => {
      pointer = pointerCoordinates(event);
      lastPointer = pointer;
      dragNode = hitTest(pointer);
      panning = !dragNode;
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
          dragNode.x += dx / zoom;
          dragNode.y += dy / zoom;
          dragNode.vx = 0;
          dragNode.vy = 0;
        } else if (panning) {
          panX += dx;
          panY += dy;
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
        if (releasedNode.type === 'post') {
          window.location.href = releasedNode.url;
        } else {
          selectedTopic = selectedTopic === releasedNode ? null : releasedNode;
        }
      }
      pointer = null;
      dragNode = null;
      panning = false;
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
      zoomAt(event.deltaY < 0 ? 1.1 : 0.9, pointerCoordinates(event));
    }, { passive: false });
    canvas.addEventListener('keydown', (event) => {
      if (event.key === '+' || event.key === '=') zoomAt(1.12);
      else if (event.key === '-' || event.key === '_') zoomAt(0.88);
      else if (event.key === 'ArrowLeft') panX += 24;
      else if (event.key === 'ArrowRight') panX -= 24;
      else if (event.key === 'ArrowUp') panY += 24;
      else if (event.key === 'ArrowDown') panY -= 24;
      else if (event.key === 'Escape' || event.key === '0') resetView();
      else return;
      event.preventDefault();
    });

    map.querySelectorAll('[data-graph-action]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.graphAction === 'zoom-in') zoomAt(1.18);
        else if (button.dataset.graphAction === 'zoom-out') zoomAt(0.82);
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
