const MAX_WIDTH = 1200;
const WEBP_QUALITY = 0.85;

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo procesar la imagen seleccionada.'));
    };

    image.src = objectUrl;
  });

const canvasToWebpBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo optimizar la imagen.'));
          return;
        }

        resolve(blob);
      },
      'image/webp',
      WEBP_QUALITY
    );
  });

export const optimizeImageBeforeUpload = async (file: File): Promise<Blob> => {
  const image = await loadImage(file);

  const shouldResize = image.width > MAX_WIDTH;
  const targetWidth = shouldResize ? MAX_WIDTH : image.width;
  const targetHeight = shouldResize
    ? Math.round((image.height * MAX_WIDTH) / image.width)
    : image.height;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No se pudo iniciar el optimizador de imágenes.');
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  return canvasToWebpBlob(canvas);
};
