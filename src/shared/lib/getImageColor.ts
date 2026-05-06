export function getImageColor(url: string, opacity: number = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas 2D context недоступен");

      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);

      try {
        const { data } = ctx.getImageData(0, 0, 1, 1);
        const r = data[0], g = data[1], b = data[2];
        const a = Math.max(0, Math.min(1, opacity));
        resolve(`rgba(${r}, ${g}, ${b}, ${a})`);
      } catch (e) {
        reject("CORS: изображение запрещает доступ к пикселям");
      }
    };

    img.onerror = () => reject("Ошибка загрузки изображения");
  });
}
