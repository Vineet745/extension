import html2canvas from 'html2canvas';

(function () {
  const overlay = document.createElement('canvas');
  const ctx = overlay.getContext('2d')!;
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '999999';
  overlay.style.cursor = 'crosshair';
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
  document.body.appendChild(overlay);

  const screenshot = () => {
    html2canvas(document.body).then(canvas => {
      overlay.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const pixel = canvas.getContext('2d')!.getImageData(x, y, 1, 1).data;
        const hex = `#${[...pixel].slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('')}`;
        navigator.clipboard.writeText(hex);
        alert(`Copied color: ${hex}`);
        overlay.remove();
      });
    });
  };

  screenshot();
})();
