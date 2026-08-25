import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Crop, ZoomIn, ZoomOut, RotateCw, RotateCcw, FlipHorizontal, 
  Check, X, RefreshCw, Eye, Sparkles, Image as ImageIcon, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  aspectRatioPreset?: 'free' | '16:9' | '4:3' | '1:1' | '3:2';
  title?: string;
}

type AspectRatio = 'free' | '16:9' | '4:3' | '1:1' | '3:2';

interface CropBox {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  width: number; // percentage (0 to 100)
  height: number; // percentage (0 to 100)
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatioPreset = 'free',
  title
}) => {
  const { language, dir } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(aspectRatioPreset);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
  const [displayedSize, setDisplayedSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Crop box in percentage of the displayed image (0-100)
  const [cropBox, setCropBox] = useState<CropBox>({
    x: 10,
    y: 10,
    width: 80,
    height: 80
  });

  // Interaction dragging states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null); // 'move' | 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r'
  const [dragStart, setDragStart] = useState<{ x: number; y: number; crop: CropBox }>({
    x: 0,
    y: 0,
    crop: { x: 10, y: 10, width: 80, height: 80 }
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Initialize or reset crop box when image loads or aspect ratio changes
  const initCropBox = useCallback((ratio: AspectRatio, imgWidth: number, imgHeight: number) => {
    if (imgWidth === 0 || imgHeight === 0) return;

    let targetW = 80;
    let targetH = 80;

    if (ratio === '1:1') {
      const minDim = Math.min(imgWidth, imgHeight);
      targetW = (minDim * 0.8 / imgWidth) * 100;
      targetH = (minDim * 0.8 / imgHeight) * 100;
    } else if (ratio === '16:9') {
      const targetAspect = 16 / 9;
      if (imgWidth / imgHeight > targetAspect) {
        targetH = 80;
        const pixelH = (imgHeight * 0.8);
        const pixelW = pixelH * targetAspect;
        targetW = Math.min(95, (pixelW / imgWidth) * 100);
      } else {
        targetW = 80;
        const pixelW = (imgWidth * 0.8);
        const pixelH = pixelW / targetAspect;
        targetH = Math.min(95, (pixelH / imgHeight) * 100);
      }
    } else if (ratio === '4:3') {
      const targetAspect = 4 / 3;
      if (imgWidth / imgHeight > targetAspect) {
        targetH = 80;
        const pixelH = (imgHeight * 0.8);
        const pixelW = pixelH * targetAspect;
        targetW = Math.min(95, (pixelW / imgWidth) * 100);
      } else {
        targetW = 80;
        const pixelW = (imgWidth * 0.8);
        const pixelH = pixelW / targetAspect;
        targetH = Math.min(95, (pixelH / imgHeight) * 100);
      }
    } else if (ratio === '3:2') {
      const targetAspect = 3 / 2;
      if (imgWidth / imgHeight > targetAspect) {
        targetH = 80;
        const pixelH = (imgHeight * 0.8);
        const pixelW = pixelH * targetAspect;
        targetW = Math.min(95, (pixelW / imgWidth) * 100);
      } else {
        targetW = 80;
        const pixelW = (imgWidth * 0.8);
        const pixelH = pixelW / targetAspect;
        targetH = Math.min(95, (pixelH / imgHeight) * 100);
      }
    } else {
      targetW = 85;
      targetH = 85;
    }

    // Ensure bounds
    targetW = Math.min(100, Math.max(15, targetW));
    targetH = Math.min(100, Math.max(15, targetH));
    const targetX = (100 - targetW) / 2;
    const targetY = (100 - targetH) / 2;

    setCropBox({
      x: Math.max(0, targetX),
      y: Math.max(0, targetY),
      width: targetW,
      height: targetH
    });
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplayedSize({ width: img.clientWidth, height: img.clientHeight });
    setImageLoaded(true);
    initCropBox(aspectRatio, img.clientWidth, img.clientHeight);
  };

  // Reset state on open or image change
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setAspectRatio(aspectRatioPreset);
      setShowPreview(false);
      setPreviewUrl(null);
    }
  }, [isOpen, imageSrc, aspectRatioPreset]);

  // Update crop box on aspect ratio selection
  const handleSelectAspectRatio = (preset: AspectRatio) => {
    setAspectRatio(preset);
    if (imageRef.current) {
      initCropBox(preset, imageRef.current.clientWidth, imageRef.current.clientHeight);
    }
  };

  // Handle Drag / Resize of Crop Box
  const handlePointerDown = (handle: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      crop: { ...cropBox }
    });
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || !dragHandle || !imageRef.current) return;

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    const initial = dragStart.crop;
    let newCrop = { ...initial };

    const minSize = 10; // minimum 10%

    if (dragHandle === 'move') {
      newCrop.x = Math.min(Math.max(0, initial.x + deltaX), 100 - initial.width);
      newCrop.y = Math.min(Math.max(0, initial.y + deltaY), 100 - initial.height);
    } else {
      let ratioValue: number | null = null;
      if (aspectRatio === '1:1') ratioValue = 1;
      else if (aspectRatio === '16:9') ratioValue = 16 / 9;
      else if (aspectRatio === '4:3') ratioValue = 4 / 3;
      else if (aspectRatio === '3:2') ratioValue = 3 / 2;

      // Handle corner resizing
      if (dragHandle.includes('r')) {
        newCrop.width = Math.min(Math.max(minSize, initial.width + deltaX), 100 - initial.x);
      }
      if (dragHandle.includes('l')) {
        const potentialWidth = initial.width - deltaX;
        if (potentialWidth >= minSize && initial.x + deltaX >= 0) {
          newCrop.x = initial.x + deltaX;
          newCrop.width = potentialWidth;
        }
      }
      if (dragHandle.includes('b')) {
        newCrop.height = Math.min(Math.max(minSize, initial.height + deltaY), 100 - initial.y);
      }
      if (dragHandle.includes('t')) {
        const potentialHeight = initial.height - deltaY;
        if (potentialHeight >= minSize && initial.y + deltaY >= 0) {
          newCrop.y = initial.y + deltaY;
          newCrop.height = potentialHeight;
        }
      }

      // If aspect ratio is locked, adjust height to match width and image proportions
      if (ratioValue) {
        const imgAspect = rect.width / rect.height;
        const targetCropAspect = ratioValue / imgAspect;
        
        if (dragHandle === 'r' || dragHandle === 'l' || dragHandle === 'br' || dragHandle === 'bl') {
          newCrop.height = newCrop.width / targetCropAspect;
          if (newCrop.y + newCrop.height > 100) {
            newCrop.height = 100 - newCrop.y;
            newCrop.width = newCrop.height * targetCropAspect;
          }
        } else if (dragHandle === 't' || dragHandle === 'b' || dragHandle === 'tr' || dragHandle === 'tl') {
          newCrop.width = newCrop.height * targetCropAspect;
          if (newCrop.x + newCrop.width > 100) {
            newCrop.width = 100 - newCrop.x;
            newCrop.height = newCrop.width / targetCropAspect;
          }
        }
      }
    }

    // Strict boundary checks
    newCrop.x = Math.max(0, Math.min(100 - newCrop.width, newCrop.x));
    newCrop.y = Math.max(0, Math.min(100 - newCrop.height, newCrop.y));
    newCrop.width = Math.max(minSize, Math.min(100 - newCrop.x, newCrop.width));
    newCrop.height = Math.max(minSize, Math.min(100 - newCrop.y, newCrop.height));

    setCropBox(newCrop);
  }, [isDragging, dragHandle, dragStart, aspectRatio]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Generate cropped image using Canvas
  const generateCroppedImage = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Compute natural pixel crop coordinates
          const naturalCropX = (cropBox.x / 100) * image.naturalWidth;
          const naturalCropY = (cropBox.y / 100) * image.naturalHeight;
          const naturalCropW = (cropBox.width / 100) * image.naturalWidth;
          const naturalCropH = (cropBox.height / 100) * image.naturalHeight;

          // Target output dimensions (limit max output to 1200px for optimal speed and size)
          let outputWidth = Math.round(naturalCropW * zoom);
          let outputHeight = Math.round(naturalCropH * zoom);
          const maxDim = 1200;

          if (outputWidth > maxDim || outputHeight > maxDim) {
            if (outputWidth > outputHeight) {
              outputHeight = Math.round((outputHeight * maxDim) / outputWidth);
              outputWidth = maxDim;
            } else {
              outputWidth = Math.round((outputWidth * maxDim) / outputHeight);
              outputHeight = maxDim;
            }
          }

          canvas.width = Math.max(1, outputWidth);
          canvas.height = Math.max(1, outputHeight);

          // Handle transformation (Rotation, Flip, Zoom)
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          if (rotation !== 0) {
            ctx.rotate((rotation * Math.PI) / 180);
          }
          if (flipH) {
            ctx.scale(-1, 1);
          }

          // Draw the cropped portion
          ctx.drawImage(
            image,
            naturalCropX,
            naturalCropY,
            naturalCropW,
            naturalCropH,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );
          ctx.restore();

          // Compress to clean JPEG
          const resultDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(resultDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      image.onerror = (err) => reject(err);
      image.src = imageSrc;
    });
  }, [cropBox, imageSrc, rotation, flipH, zoom]);

  // Live preview generator
  useEffect(() => {
    if (showPreview && isOpen) {
      generateCroppedImage()
        .then((url) => setPreviewUrl(url))
        .catch((e) => console.warn('Preview error:', e));
    }
  }, [showPreview, isOpen, cropBox, rotation, flipH, zoom, generateCroppedImage]);

  const handleApplyCrop = async () => {
    try {
      const croppedUrl = await generateCroppedImage();
      onCropComplete(croppedUrl);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
      // Fallback: pass original image
      onCropComplete(imageSrc);
      onClose();
    }
  };

  const handleUseOriginal = () => {
    onCropComplete(imageSrc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="image-cropper-modal" className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4">
      {/* Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
      />

      {/* Main Cropper Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        dir={dir}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-10"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950 shrink-0 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{title || (language === 'ar' ? 'تحديد واقتصاص جزء من الصورة' : 'Görselden Alan Seç ve Kırp')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 font-normal">
                  {aspectRatio === 'free' 
                    ? (language === 'ar' ? 'حر' : 'Serbest') 
                    : aspectRatio}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ar' 
                  ? 'اسحب المربع لتحديد الجزء المرغوب، أو استخدم أدوات التدوير والتكبير أدناه.' 
                  : 'İstediğiniz alanı seçmek için kutuyu sürükleyin, döndürme ve yakınlaştırma araçlarını kullanın.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                showPreview ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'ar' ? 'معاينة النتيجة' : 'Önizleme'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Workspace (Canvas Viewport) */}
        <div className="flex-1 min-h-[300px] max-h-[55vh] overflow-hidden bg-slate-950/90 relative flex items-center justify-center p-4 select-none">
          
          {/* Subtle Grid Canvas Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Normal View or Live Preview */}
          {showPreview && previewUrl ? (
            <div className="flex flex-col items-center justify-center space-y-3 z-10">
              <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-sm max-h-[45vh] overflow-hidden">
                <img src={previewUrl} alt="Crop Preview" className="max-h-[40vh] w-auto object-contain rounded-lg" />
              </div>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'ar' ? 'هكذا ستظهر الصورة بعد اعتماد القص' : 'Kırpma onaylandıktan sonra görsel böyle görünecek'}
              </span>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className="relative inline-block max-w-full max-h-[50vh] touch-none shadow-2xl rounded-lg overflow-hidden border border-slate-800"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) ${flipH ? 'scaleX(-1)' : ''}`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              {/* Base Image */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Source for cropping"
                onLoad={handleImageLoad}
                draggable={false}
                className="max-h-[48vh] w-auto max-w-full object-contain block select-none pointer-events-none"
              />

              {/* Dimmed Backdrop Mask outside Crop Area */}
              {imageLoaded && (
                <>
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top Mask */}
                    <div 
                      className="absolute top-0 left-0 right-0 bg-slate-950/70 backdrop-blur-[0.5px]"
                      style={{ height: `${cropBox.y}%` }}
                    />
                    {/* Bottom Mask */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-slate-950/70 backdrop-blur-[0.5px]"
                      style={{ height: `${100 - (cropBox.y + cropBox.height)}%` }}
                    />
                    {/* Left Mask */}
                    <div 
                      className="absolute left-0 bg-slate-950/70 backdrop-blur-[0.5px]"
                      style={{ 
                        top: `${cropBox.y}%`, 
                        height: `${cropBox.height}%`, 
                        width: `${cropBox.x}%` 
                      }}
                    />
                    {/* Right Mask */}
                    <div 
                      className="absolute right-0 bg-slate-950/70 backdrop-blur-[0.5px]"
                      style={{ 
                        top: `${cropBox.y}%`, 
                        height: `${cropBox.height}%`, 
                        width: `${100 - (cropBox.x + cropBox.width)}%` 
                      }}
                    />
                  </div>

                  {/* Active Crop Box Window */}
                  <div
                    className="absolute cursor-move border-2 border-amber-400 bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.5)] touch-none"
                    style={{
                      left: `${cropBox.x}%`,
                      top: `${cropBox.y}%`,
                      width: `${cropBox.width}%`,
                      height: `${cropBox.height}%`
                    }}
                    onPointerDown={(e) => handlePointerDown('move', e)}
                  >
                    {/* Rule of Thirds Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/60 border-dashed" />
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/60 border-dashed" />
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/60 border-dashed" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/60 border-dashed" />
                    </div>

                    {/* Dimensions Pill Tag */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950/90 text-amber-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/40 pointer-events-none whitespace-nowrap">
                      {Math.round((cropBox.width / 100) * naturalSize.width)} × {Math.round((cropBox.height / 100) * naturalSize.height)} px
                    </div>

                    {/* Corner Resize Handles */}
                    <div
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-xs cursor-nwse-resize shadow-md"
                      onPointerDown={(e) => handlePointerDown('tl', e)}
                    />
                    <div
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-xs cursor-nesw-resize shadow-md"
                      onPointerDown={(e) => handlePointerDown('tr', e)}
                    />
                    <div
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-xs cursor-nesw-resize shadow-md"
                      onPointerDown={(e) => handlePointerDown('bl', e)}
                    />
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-xs cursor-nwse-resize shadow-md"
                      onPointerDown={(e) => handlePointerDown('br', e)}
                    />

                    {/* Edge Resize Handles */}
                    <div
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-4 bg-amber-400/80 rounded-xs cursor-ew-resize"
                      onPointerDown={(e) => handlePointerDown('l', e)}
                    />
                    <div
                      className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-4 bg-amber-400/80 rounded-xs cursor-ew-resize"
                      onPointerDown={(e) => handlePointerDown('r', e)}
                    />
                    <div
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2 w-4 bg-amber-400/80 rounded-xs cursor-ns-resize"
                      onPointerDown={(e) => handlePointerDown('t', e)}
                    />
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2 w-4 bg-amber-400/80 rounded-xs cursor-ns-resize"
                      onPointerDown={(e) => handlePointerDown('b', e)}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Toolbar & Ratio Selector */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0 select-none">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Aspect Ratio Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">
                {language === 'ar' ? 'نسبة القص:' : 'Oran:'}
              </span>
              {(['free', '16:9', '4:3', '1:1', '3:2'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => handleSelectAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    aspectRatio === ratio
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                  }`}
                >
                  {ratio === 'free' 
                    ? (language === 'ar' ? 'حر' : 'Serbest') 
                    : ratio}
                </button>
              ))}
            </div>

            {/* Transform Controls (Zoom, Rotate, Flip) */}
            <div className="flex items-center gap-2">
              {/* Rotate Left */}
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90) % 360)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={language === 'ar' ? 'تدوير لليسار 90°' : 'Sola Döndür 90°'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Rotate Right */}
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={language === 'ar' ? 'تدوير لليمين 90°' : 'Sağa Döndür 90°'}
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Flip Horizontal */}
              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                className={`p-2 rounded-lg transition cursor-pointer ${
                  flipH ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={language === 'ar' ? 'عكس أفقي' : 'Yatay Çevir'}
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>

              {/* Reset view */}
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setFlipH(false);
                  if (imageRef.current) {
                    initCropBox(aspectRatio, imageRef.current.clientWidth, imageRef.current.clientHeight);
                  }
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title={language === 'ar' ? 'إعادة ضبط' : 'Sıfırla'}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Confirmation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleUseOriginal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              {language === 'ar' ? 'استخدام الصورة كاملة بدون قص' : 'Kırpmadan Orijinalini Kullan'}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'İptal'}
              </button>

              <button
                id="confirm-crop-btn"
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'ar' ? 'اعتماد واقتصاص الجزء المحدد' : 'Seçili Alanı Kırp ve Onayla'}</span>
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
