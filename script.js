(() => {
  const dropZone = document.getElementById('drop-zone');
  const imageInput = document.getElementById('image-input');
  const logoInput = document.getElementById('logo-input');
  const canvas = document.getElementById('preview-canvas');
  const ctx = canvas.getContext('2d');
  const emptyHint = document.getElementById('empty-hint');
  const downloadBtn = document.getElementById('download-btn');
  const exportFormat = document.getElementById('export-format');

  const textFields = document.getElementById('text-fields');
  const logoFields = document.getElementById('logo-fields');
  const tileFields = document.getElementById('tile-fields');
  const positionGrid = document.getElementById('position-grid');

  const wmText = document.getElementById('wm-text');
  const wmFont = document.getElementById('wm-font');
  const wmColor = document.getElementById('wm-color');
  const wmSize = document.getElementById('wm-size');
  const wmSizeVal = document.getElementById('wm-size-val');
  const wmOpacity = document.getElementById('wm-opacity');
  const wmOpacityVal = document.getElementById('wm-opacity-val');
  const wmRotation = document.getElementById('wm-rotation');
  const wmRotationVal = document.getElementById('wm-rotation-val');
  const wmSpacing = document.getElementById('wm-spacing');
  const wmSpacingVal = document.getElementById('wm-spacing-val');

  const state = {
    baseImage: null,
    logoImage: null,
    type: 'text',
    mode: 'single',
    pos: { x: 0.95, y: 0.95 },
  };

  function loadImageFile(file, onLoad) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => onLoad(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  imageInput.addEventListener('change', () => {
    loadImageFile(imageInput.files[0], (img) => {
      state.baseImage = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      emptyHint.style.display = 'none';
      downloadBtn.disabled = false;
      draw();
    });
  });

  ['dragover', 'dragleave', 'drop'].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.toggle('dragover', evt === 'dragover');
    });
  });
  dropZone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      imageInput.files = e.dataTransfer.files;
      loadImageFile(file, (img) => {
        state.baseImage = img;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        emptyHint.style.display = 'none';
        downloadBtn.disabled = false;
        draw();
      });
    }
  });

  logoInput.addEventListener('change', () => {
    loadImageFile(logoInput.files[0], (img) => {
      state.logoImage = img;
      draw();
    });
  });

  document.querySelectorAll('input[name="wm-type"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      state.type = e.target.value;
      textFields.hidden = state.type !== 'text';
      logoFields.hidden = state.type !== 'logo';
      draw();
    });
  });

  document.querySelectorAll('input[name="wm-mode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      state.mode = e.target.value;
      tileFields.hidden = state.mode !== 'tiled';
      document.getElementById('position-fields').style.display = state.mode === 'tiled' ? 'none' : '';
      draw();
    });
  });

  positionGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    state.pos = { x: parseFloat(btn.dataset.x), y: parseFloat(btn.dataset.y) };
    positionGrid.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    draw();
  });

  [wmText, wmFont, wmColor].forEach((el) => el.addEventListener('input', draw));

  function bindRange(input, label, suffix = '') {
    input.addEventListener('input', () => {
      label.textContent = input.value + suffix;
      draw();
    });
  }
  bindRange(wmSize, wmSizeVal);
  bindRange(wmOpacity, wmOpacityVal);
  bindRange(wmRotation, wmRotationVal);
  bindRange(wmSpacing, wmSpacingVal);

  // Drag to reposition the single watermark directly on the canvas
  let dragging = false;
  function canvasToRelative(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
  }
  canvas.addEventListener('pointerdown', (e) => {
    if (!state.baseImage || state.mode !== 'single') return;
    dragging = true;
    state.pos = canvasToRelative(e.clientX, e.clientY);
    positionGrid.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    draw();
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    state.pos = canvasToRelative(e.clientX, e.clientY);
    draw();
  });
  window.addEventListener('pointerup', () => { dragging = false; });

  function drawWatermarkAt(cx, cy) {
    const opacity = wmOpacity.value / 100;
    const rotation = (wmRotation.value * Math.PI) / 180;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    if (state.type === 'logo' && state.logoImage) {
      const size = parseInt(wmSize.value, 10) * 2;
      const ratio = state.logoImage.naturalHeight / state.logoImage.naturalWidth;
      const w = size;
      const h = size * ratio;
      ctx.drawImage(state.logoImage, -w / 2, -h / 2, w, h);
    } else {
      const size = parseInt(wmSize.value, 10);
      ctx.font = `${size}px ${wmFont.value}`;
      ctx.fillStyle = wmColor.value;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(wmText.value || '', 0, 0);
    }
    ctx.restore();
  }

  function draw() {
    if (!state.baseImage) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(state.baseImage, 0, 0, canvas.width, canvas.height);

    if (state.mode === 'tiled') {
      const spacing = parseInt(wmSpacing.value, 10);
      for (let y = spacing / 2; y < canvas.height + spacing; y += spacing) {
        for (let x = spacing / 2; x < canvas.width + spacing; x += spacing) {
          drawWatermarkAt(x, y);
        }
      }
    } else {
      drawWatermarkAt(state.pos.x * canvas.width, state.pos.y * canvas.height);
    }
  }

  downloadBtn.addEventListener('click', () => {
    if (!state.baseImage) return;
    const format = exportFormat.value;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.download = `wasserzeichen.${ext}`;
    link.href = canvas.toDataURL(format, 0.92);
    link.click();
  });
})();
