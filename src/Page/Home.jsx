import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { InsertcarsAction } from '../Redux/Action/carsAction';
import logo from "../assets/Front.png"
import CarViewCard from '../components/Home/CarViewCard';
import CarInfoForm from '../components/Home/CarInfoForm';
import DrawingTools from '../components/Home/DrawingTools';
import { Eye } from 'lucide-react';

const CarDamageDrawing = () => {
const dispatch=useDispatch()
  const [activeCard, setActiveCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  // دۆخە نوێکان بۆ شێوە هەندەسییەکان
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [circleStart, setCircleStart] = useState(null);
  const [shapeStart, setShapeStart] = useState(null);
  const [previewCircle, setPreviewCircle] = useState(null);
  const [previewShape, setPreviewShape] = useState(null);
  const [drawingMode, setDrawingMode] = useState('pen'); // 'pen', 'circle', 'filled-circle', 'fill', 'rectangle', 'filled-rectangle', 'triangle', 'filled-triangle'
  
  const [currentColor, setCurrentColor] = useState('#dc2626');
  const [brushSize, setBrushSize] = useState(3);
  const [fullscreenView, setFullscreenView] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canvasRefs = useRef({});
  const fullscreenCanvasRef = useRef(null);
  const fileInputRefs = useRef({});
const [clickInfo, setClickInfo] = useState({
  isDown: false,
  moved: false,
  start: { x: 0, y: 0 },
  viewId: null,
});
  const [carInfo, setCarInfo] = useState({
    carType: '',
    chassisNumber: '',
    model: '',
    phoneNumber: '',
    fullName: '',
    kilometers: '',
    details: ''
  });

  const [images, setImages] = useState({
    front: null, back: null, left: null, right: null, top: null
  });

  const [paths, setPaths] = useState({
    front: [], back: [], left: [], right: [], top: []
  });

  const views = [
    { id: 'front', name: 'دیمەنی پێشەوە', icon: '🚗', description: 'بەفرەی پێشەوە و لایتەکان' },
    { id: 'back', name: 'دیمەنی دواوە', icon: '🔙', description: 'بەفرەی دواوە و لایتەکان' },
    { id: 'left', name: 'لاینە چەپ', icon: '👈', description: 'دەرگاکان و ئاویەنەی چەپ' },
    { id: 'right', name: 'لاینە ڕاست', icon: '👉', description: 'دەرگاکان و ئاویەنەی ڕاست' },
    { id: 'top', name: 'دیمەنی سەرەوە', icon: '🔝', description: 'سقف و بەشە سەرەوەیی' }
  ];

  const colors = [
    { color: '#FF2A00', name: 'بۆیاخ' },
    { color: '#039E00', name: 'گۆڕاو' },
    { color: '#FBFF00', name: 'کات' },
    { color: '#000000', name: 'تجاري' },
    { color: '#0019FF', name: 'سارد' },
    { color: 'eraser', name: 'سڕەو' }
  ];

  // ئامرازەکانی وێنەکێشان (پێوەکراوەکان)
  const drawingTools = [
    { mode: 'pen', name: 'قەڵەمی ئازاد', icon: '✏️' },
    { mode: 'fill', name: 'پڕکردنەوەی ناوچە', icon: '🪣' },
    { mode: 'circle', name: 'بازنەی بەتاڵ', icon: '⭕' },
    { mode: 'filled-circle', name: 'بازنەی پڕ', icon: '🔴' },
    { mode: 'rectangle', name: 'چوارگۆشەی بەتاڵ', icon: '⬜' },
    { mode: 'filled-rectangle', name: 'چوارگۆشەی پڕ', icon: '🟦' },
    { mode: 'triangle', name: 'سێگۆشەی بەتاڵ', icon: '🔺' },
    { mode: 'filled-triangle', name: 'سێگۆشەی پڕ', icon: '🔻' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // پشکنینی زانیاریی ئۆتۆمبێل
    if (!carInfo.carType.trim()) {
      newErrors.carType = 'جۆری ئۆتۆمبێل پێویستە';
    }
    
    if (!carInfo.chassisNumber.trim()) {
      newErrors.chassisNumber = 'ژمارەی شاسی پێویستە';
    } else if (carInfo.chassisNumber.trim().length < 10) {
      newErrors.chassisNumber = 'ژمارەی شاسی دەبێت بە لای کەمەوە 10 پیت بێت';
    }
    
    if (!carInfo.model.trim()) {
      newErrors.model = 'مۆدێلی ئۆتۆمبێل پێویستە';
    }
    
    if (!carInfo.fullName.trim()) {
      newErrors.fullName = 'ناوی تەواو پێویستە';
    } else if (carInfo.fullName.trim().length < 3) {
      newErrors.fullName = 'ناوەکە دەبێت بە لای کەمەوە 3 پیت بێت';
    }
    
    if (!carInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'ژمارەی تەلەفۆن پێویستە';
    } else if (!/^07\d{9}$/.test(carInfo.phoneNumber.trim()) ) {
      newErrors.phoneNumber = 'ژمارەی تەلەفۆن دەبێت بە 07 دەست پێبکات و 11 ژمارە بێت';
    }
    
    if (!carInfo.kilometers.trim()) {
      newErrors.kilometers = 'ژمارەی کیلۆمەتر پێویستە';
    } else if (isNaN(carInfo.kilometers) || Number(carInfo.kilometers) < 0) {
      newErrors.kilometers = 'پێویستە ژمارەی دروست بنووسیت بۆ کیلۆمەتر';
    }
    
    // پشکنین: کمێک وێنە ببارن
    const hasImages = Object.values(images).some(img => img !== null);
    if (!hasImages) {
      views.forEach(view => {
        newErrors[view.id] = 'دەتەوێت کەمێک وێنە بارهێنرێت';
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // یارمەتی: گۆڕینی hex بۆ RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleCarInfoChange = (field, value) => {
    setCarInfo(prev => ({ ...prev, [field]: value }));
    // هەڵە بسڕەوە کاتێک نووسین دەکرێت
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (viewId, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImages(prev => ({ ...prev, [viewId]: img }));
          // هەڵەی ئەم وێنەیە بسڕەوە
          if (errors[viewId]) {
            setErrors(prev => ({ ...prev, [viewId]: '' }));
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const openFullscreen = (viewId) => {
    if (images[viewId]) {
      setFullscreenView(viewId);
    }
  };

  const closeFullscreen = () => setFullscreenView(null);

const getCanvasCoordinates = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  // یەکسانکردنی هەموو ناوڕاستەکان بۆ قەبارەی بنەڕەت (400x300)
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  
  // گۆڕینی قەبارە بۆ بنەڕەت
  const baseWidth = 400;
  const baseHeight = 300;
  
  return {
    x: (x / canvas.width) * baseWidth,
    y: (y / canvas.height) * baseHeight,
  };
};

const eraseAtPosition = (viewId, x, y) => {
  const eraserRadius = brushSize * 2;

  setPaths(prev => {
    const updatedPaths = prev[viewId].filter(path => {
      // freehand
      if (path.points) {
        return !path.points.some(point => {
          const distance = Math.hypot(point.x - x, point.y - y);
          return distance <= eraserRadius;
        });
      }
      // circle
      if (path.type === 'circle' && path.circle) {
        const distance = Math.hypot(path.circle.centerX - x, path.circle.centerY - y);
        return distance > path.circle.radius + eraserRadius;
      }
      // geometric shape (rectangle/triangle)
      if (path.type === 'shape' && path.shape) {
        const isInsideShape = isPointInsideShape(x, y, path.shape);
        return !isInsideShape || (isInsideShape && Math.random() > 0.7);
      }
      // dot
      if (path.type === 'dot' && path.dot) {
        const distance = Math.hypot(path.dot.x - x, path.dot.y - y);
        return distance > eraserRadius;
      }
      return true;
    });

    return { ...prev, [viewId]: updatedPaths };
  });
};

  // دۆزینەوەی خولییەتی خاڵەکە لە ناو شێوەدا
  const isPointInsideShape = (x, y, shape) => {
    switch (shape.type) {
      case 'rectangle':
        return x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2;
      case 'triangle':
        // باریسێنتریک بۆ سێگۆشە
        const { x1, y1, x2, y2, x3, y3 } = shape;
        const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
        const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
        const c = 1 - a - b;
        return a >= 0 && b >= 0 && c >= 0;
      default:
        return false;
    }
  };

const startDrawing = (e, viewId, isFullscreen = false) => {
  if (!images[viewId]) return;

  const canvas = isFullscreen ? fullscreenCanvasRef.current : canvasRefs.current[viewId];
  const { x, y } = getCanvasCoordinates(e, canvas);

  // mark click start
  setClickInfo({ isDown: true, moved: false, start: { x, y }, viewId });

  if (currentColor === 'eraser') {
    setIsErasing(true);
    eraseAtPosition(viewId, x, y);
  } else if (drawingMode === 'circle' || drawingMode === 'filled-circle') {
    setIsDrawingCircle(true);
    setCircleStart({ x, y, viewId });
    setPreviewCircle(null);
  } else if (
    drawingMode === 'rectangle' || drawingMode === 'filled-rectangle' ||
    drawingMode === 'triangle' || drawingMode === 'filled-triangle'
  ) {
    setIsDrawingShape(true);
    setShapeStart({ x, y, viewId, mode: drawingMode });
    setPreviewShape(null);
  } else {
    // pen (freehand)
    setIsDrawing(true);
    const newPath = {
      type: 'freehand',
      color: currentColor,
      size: brushSize,
      points: [{ x, y }]
    };
    setPaths(prev => ({ ...prev, [viewId]: [...prev[viewId], newPath] }));
  }
};

const draw = (e, viewId, isFullscreen = false) => {
  if (!images[viewId]) return;

  const canvas = isFullscreen ? fullscreenCanvasRef.current : canvasRefs.current[viewId];
  const { x, y } = getCanvasCoordinates(e, canvas);

  // mark as moved if pointer traveled a small threshold
  if (clickInfo.isDown && clickInfo.viewId === viewId) {
    const dx = x - clickInfo.start.x;
    const dy = y - clickInfo.start.y;
    const moved = Math.hypot(dx, dy) > 2; // threshold in normalized space
    if (moved && !clickInfo.moved) {
      setClickInfo(prev => ({ ...prev, moved: true }));
    }
  }

  if (currentColor === 'eraser' && isErasing) {
    eraseAtPosition(viewId, x, y);
  } else if (isDrawingCircle && circleStart && circleStart.viewId === viewId) {
    // preview circle
    const radius = Math.hypot(x - circleStart.x, y - circleStart.y);
    setPreviewCircle({
      centerX: circleStart.x,
      centerY: circleStart.y,
      radius,
      color: currentColor,
      size: brushSize,
      filled: drawingMode === 'filled-circle'
    });
  } else if (isDrawingShape && shapeStart && shapeStart.viewId === viewId) {
    // preview shapes
    if (shapeStart.mode === 'rectangle' || shapeStart.mode === 'filled-rectangle') {
      setPreviewShape({
        type: 'rectangle',
        x1: Math.min(shapeStart.x, x),
        y1: Math.min(shapeStart.y, y),
        x2: Math.max(shapeStart.x, x),
        y2: Math.max(shapeStart.y, y),
        color: currentColor,
        size: brushSize,
        filled: shapeStart.mode === 'filled-rectangle'
      });
    } else if (shapeStart.mode === 'triangle' || shapeStart.mode === 'filled-triangle') {
      const width = Math.abs(x - shapeStart.x) * 2;
      const height = Math.abs(y - shapeStart.y);
      setPreviewShape({
        type: 'triangle',
        x1: shapeStart.x,
        y1: shapeStart.y,
        x2: shapeStart.x - width / 2,
        y2: y,
        x3: shapeStart.x + width / 2,
        y3: y,
        color: currentColor,
        size: brushSize,
        filled: shapeStart.mode === 'filled-triangle'
      });
    }
  } else if (isDrawing) {
    // continue freehand stroke
    setPaths(prev => {
      const currentPaths = [...prev[viewId]];
      if (currentPaths.length > 0 && currentPaths[currentPaths.length - 1].points) {
        currentPaths[currentPaths.length - 1].points.push({ x, y });
      }
      return { ...prev, [viewId]: currentPaths };
    });
  }
};



const stopDrawing = (viewId) => {
  // finalize circle
  if (isDrawingCircle && previewCircle && circleStart) {
    const newCircle = {
      type: 'circle',
      color: previewCircle.color,
      size: previewCircle.size,
      circle: {
        centerX: previewCircle.centerX,
        centerY: previewCircle.centerY,
        radius: previewCircle.radius,
        filled: previewCircle.filled
      }
    };
    setPaths(prev => ({
      ...prev,
      [circleStart.viewId]: [...prev[circleStart.viewId], newCircle]
    }));
    setPreviewCircle(null);
  }

  // finalize shape
  if (isDrawingShape && previewShape && shapeStart) {
    const newShape = {
      type: 'shape',
      color: previewShape.color,
      size: previewShape.size,
      shape: previewShape
    };
    setPaths(prev => ({
      ...prev,
      [shapeStart.viewId]: [...prev[shapeStart.viewId], newShape]
    }));
    setPreviewShape(null);
  }

  // if it was a pure click in pen mode => create a dot
  if (
    clickInfo.isDown &&
    !clickInfo.moved &&
    clickInfo.viewId === viewId &&
    drawingMode === 'pen' &&
    currentColor !== 'eraser'
  ) {
    const dot = {
      type: 'dot',
      color: currentColor,
      size: brushSize,
      dot: { x: clickInfo.start.x, y: clickInfo.start.y }
    };
    setPaths(prev => ({
      ...prev,
      [viewId]: [...prev[viewId], dot]
    }));
  }

  // reset flags
  setIsDrawing(false);
  setIsErasing(false);
  setIsDrawingCircle(false);
  setIsDrawingShape(false);
  setCircleStart(null);
  setShapeStart(null);
  setClickInfo({ isDown: false, moved: false, start: { x: 0, y: 0 }, viewId: null });
};


  const clearView = (viewId) => {
    setPaths(prev => ({ ...prev, [viewId]: [] }));
    setPreviewCircle(null);
    setPreviewShape(null);
  };

  const removeImage = (viewId) => {
    setImages(prev => ({ ...prev, [viewId]: null }));
    clearView(viewId);
  };

const redrawCanvas = (viewId, isFullscreen = false) => {
  const canvas = isFullscreen ? fullscreenCanvasRef.current : canvasRefs.current[viewId];
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // base scale for 400x300 logical space
  const baseWidth = 400;
  const baseHeight = 300;
  const scaleX = canvas.width / baseWidth;
  const scaleY = canvas.height / baseHeight;

  if (images[viewId]) {
    ctx.drawImage(images[viewId], 0, 0, canvas.width, canvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isFullscreen) {
      const view = views.find(v => v.id === viewId);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(view.icon, canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = 'bold 18px Arial';
      ctx.fillText('کلیک بکە "هەڵبژاردنی وێنە"', canvas.width / 2, canvas.height / 2 + 10);
      ctx.font = '16px Arial';
      ctx.fillText('بۆ بارکردنی وێنەی ئۆتۆمبێل', canvas.width / 2, canvas.height / 2 + 35);
    }
  }

  // draw paths
  paths[viewId].forEach(path => {
    if (path.color === 'eraser') return;

    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // DOT
    if (path.type === 'dot' && path.dot) {
      ctx.fillStyle = path.color;
      const r = Math.max(1, (path.size / 2) * Math.max(scaleX, scaleY));
      ctx.beginPath();
      ctx.arc(path.dot.x * scaleX, path.dot.y * scaleY, r, 0, 2 * Math.PI);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      return;
    }

    // CIRCLE
    if (path.type === 'circle' && path.circle) {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size * Math.max(scaleX, scaleY);
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'source-over';

      ctx.beginPath();
      ctx.arc(
        path.circle.centerX * scaleX,
        path.circle.centerY * scaleY,
        path.circle.radius * Math.max(scaleX, scaleY),
        0,
        2 * Math.PI
      );

      if (path.circle.filled) {
        ctx.fillStyle = path.color;
        ctx.globalAlpha = 1.0;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
      }
      ctx.stroke();

    // SHAPE
    } else if (path.type === 'shape' && path.shape) {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size * Math.max(scaleX, scaleY);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';

      if (path.shape.type === 'rectangle') {
        const width = (path.shape.x2 - path.shape.x1) * scaleX;
        const height = (path.shape.y2 - path.shape.y1) * scaleY;

        ctx.beginPath();
        ctx.rect(path.shape.x1 * scaleX, path.shape.y1 * scaleY, width, height);

        if (path.shape.filled) {
          ctx.fillStyle = path.color;
          ctx.globalAlpha = 1.0;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
        ctx.stroke();

      } else if (path.shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(path.shape.x1 * scaleX, path.shape.y1 * scaleY);
        ctx.lineTo(path.shape.x2 * scaleX, path.shape.y2 * scaleY);
        ctx.lineTo(path.shape.x3 * scaleX, path.shape.y3 * scaleY);
        ctx.closePath();

        if (path.shape.filled) {
          ctx.fillStyle = path.color;
          ctx.globalAlpha = 1.0;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
        ctx.stroke();
      }

    // FILL AREAS
    } else if (path.type === 'fill' && path.fillArea) {
      ctx.fillStyle = path.color;
      ctx.globalAlpha = 0.5;
      ctx.globalCompositeOperation = 'source-over';

      const batchSize = 1000;
      for (let i = 0; i < path.fillArea.length; i += batchSize) {
        const batch = path.fillArea.slice(i, i + batchSize);

        ctx.beginPath();
        batch.forEach(pixel => {
          ctx.rect(pixel.x * scaleX, pixel.y * scaleY, 1 * scaleX, 1 * scaleY);
        });
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = path.color;
      ctx.lineWidth = 2 * Math.max(scaleX, scaleY);
      ctx.globalAlpha = 0.8;

      if (path.fillArea.length > 100) {
        const boundaryPoints = findBoundaryPoints(path.fillArea);
        if (boundaryPoints.length > 2) {
          ctx.beginPath();
          ctx.moveTo(boundaryPoints[0].x * scaleX, boundaryPoints[0].y * scaleY);
          boundaryPoints.forEach(point => ctx.lineTo(point.x * scaleX, point.y * scaleY));
          ctx.closePath();
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;

    // FREEHAND
    } else if (path.points && path.points.length >= 2) {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size * Math.max(scaleX, scaleY);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';

      ctx.beginPath();
      ctx.moveTo(path.points[0].x * scaleX, path.points[0].y * scaleY);
      path.points.forEach(point => ctx.lineTo(point.x * scaleX, point.y * scaleY));
      ctx.stroke();
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });

  // preview circle
  if (previewCircle && viewId === (circleStart?.viewId) && (isFullscreen ? fullscreenView === viewId : true)) {
    ctx.strokeStyle = previewCircle.color;
    ctx.lineWidth = previewCircle.size * Math.max(scaleX, scaleY);
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.arc(
      previewCircle.centerX * scaleX,
      previewCircle.centerY * scaleY,
      previewCircle.radius * Math.max(scaleX, scaleY),
      0,
      2 * Math.PI
    );

    if (previewCircle.filled) {
      ctx.fillStyle = previewCircle.color;
      ctx.globalAlpha = 1.2;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // preview shape
  if (previewShape && viewId === (shapeStart?.viewId) && (isFullscreen ? fullscreenView === viewId : true)) {
    ctx.strokeStyle = previewShape.color;
    ctx.lineWidth = previewShape.size * Math.max(scaleX, scaleY);
    ctx.setLineDash([5, 5]);

    if (previewShape.type === 'rectangle') {
      const width = (previewShape.x2 - previewShape.x1) * scaleX;
      const height = (previewShape.y2 - previewShape.y1) * scaleY;

      ctx.beginPath();
      ctx.rect(previewShape.x1 * scaleX, previewShape.y1 * scaleY, width, height);

      if (previewShape.filled) {
        ctx.fillStyle = previewShape.color;
        ctx.globalAlpha = 1.0;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      ctx.stroke();

    } else if (previewShape.type === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(previewShape.x1 * scaleX, previewShape.y1 * scaleY);
      ctx.lineTo(previewShape.x2 * scaleX, previewShape.y2 * scaleY);
      ctx.lineTo(previewShape.x3 * scaleX, previewShape.y3 * scaleY);
      ctx.closePath();

      if (previewShape.filled) {
        ctx.fillStyle = previewShape.color;
        ctx.globalAlpha = 1.0;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }

  ctx.globalCompositeOperation = 'source-over';
};


  const handleSubmit = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      formData.append("chassis_number", carInfo.chassisNumber);
      formData.append("model", carInfo.model);
      formData.append("full_name", carInfo.fullName);
      formData.append("phone_number", carInfo.phoneNumber);
      formData.append("car_type", carInfo.carType);
      formData.append("km", carInfo.kilometers);
      formData.append("details", carInfo.details);
      
      const imagePromises = [];
      
      Object.entries(images).forEach(([viewId, image]) => {
        if (image && canvasRefs.current[viewId]) {
          const canvas = canvasRefs.current[viewId];
          
          const promise = new Promise((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                formData.append(viewId, blob, `${viewId}.png`);
              }
              resolve();
            }, 'image/png', 0.9);
          });
          
          imagePromises.push(promise);
        }
      });
      
      await Promise.all(imagePromises);
      
      console.log("Sending data to backend...");
      console.log("Form data entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      await dispatch(InsertcarsAction(formData))
      
      alert('✅ داتا بە سەرکەوتوویی نێردرا!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ هەڵە ڕویدا لە ناردنی داتا');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    views.forEach(view => redrawCanvas(view.id));
    if (fullscreenView) {
      redrawCanvas(fullscreenView, true);
    }
  }, [paths, images, fullscreenView, brushSize, currentColor, previewCircle, previewShape]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4" dir="rtl">
 
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-1 space-y-6">
          <button onClick={()=>{
            window.location="/dashboard"
          }} className="w-full items-center  border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg flex  gap-2 font-semibold transition-all">
            <Eye size={20} />
            تۆمارەکان
          </button>
          <CarInfoForm carInfo={carInfo} handleCarInfoChange={handleCarInfoChange} errors={errors} />
          
          {/* ئامرازەکانی وێنەکێشان */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              ئامرازەکانی وێنەکێشان
            </h3>
            
            {/* هەڵبژاردنی ئامرازی وێنەکێشان */}
            <div className="mb-4">
              <label className="text-sm font-bold text-gray-700 block mb-2">ئامراز هەڵبژێرە:</label>
              <div className="grid grid-cols-1 gap-2">
                {drawingTools.map((tool) => (
                  <button
                    key={tool.mode}
                    onClick={() => setDrawingMode(tool.mode)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      drawingMode === tool.mode 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="font-semibold text-gray-700">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* هەڵبژاردنی رنگ */}
            <div className="mb-4">
              <label className="text-sm font-bold text-gray-700 block mb-2">جۆری زیان:</label>
              <div className="space-y-2">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setCurrentColor(colorOption.color)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 w-full ${
                      currentColor === colorOption.color 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border shadow-sm flex items-center justify-center"
                      style={{ 
                        backgroundColor: colorOption.color === 'eraser' ? '#f3f4f6' : colorOption.color, 
                        border: colorOption.color === 'eraser' ? '2px solid #ef4444' : '2px solid rgba(0,0,0,0.1)' 
                      }}
                    >
                      {colorOption.color === 'eraser' && <span className="text-red-500 text-xs">🗑️</span>}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">{colorOption.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">
                قەبارەی ئامراز: {brushSize}px
              </label>
              <input
                type="range"
                min="2"
                max="25"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>ڕێنمایی:</strong> شێوەی گونجاو هەڵبژێرە بۆ جۆری زیان: ⭕ بۆ زیانی بازنەیی، ⬜ بۆ خراشە چوارگۆشەیی، 🔺 بۆ زیانی سێگۆشەیی. لە خاڵی دەستپێکەوە بکێشە بۆ خاڵی کۆتایی.
              </p>
            </div>
          </div>
          
          {/* دوگمەی ناردن */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ناردن جاریدەکات...
                </>
              ) : (
                <>
                  📨 ناردنی داتا
                </>
              )}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                دڵنیابەوە هەموو خانە پێویستەکان پڕکردووە و وێنەکان بار کراون
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {views.map(view => (
              <CarViewCard
                key={view.id}
                view={view}
                paths={paths}
                images={images}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                startDrawing={startDrawing}
                draw={draw}
                stopDrawing={() => stopDrawing(view.id)}
                openFullscreen={openFullscreen}
                handleImageUpload={handleImageUpload}
                clearView={clearView}
                removeImage={removeImage}
                fileInputRefs={fileInputRefs}
                canvasRefs={canvasRefs}
                errors={errors}
              />
            ))}
          </div>
        </div>
      </div>

      {/* مۆدی شاشەی پڕ - هەمان ناوەڕۆک بە هەموو نوێکارییەکان */}
      {fullscreenView && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{views.find(v => v.id === fullscreenView)?.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{views.find(v => v.id === fullscreenView)?.name}</h2>
                    <p className="text-blue-100">شاشەی پڕ - مەیدانی زیاتر بۆ وێنەکێشان و وردەکاری</p>
                  </div>
                </div>
                <button 
                  onClick={closeFullscreen} 
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-bold transition-all duration-200 hover:scale-110"
                >
                  ❌ داخستن
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
              {/* پەنێڵی وردەکاری ئۆتۆمبێل */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    وردەکاری ئۆتۆمبێل
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">جۆر:</span>
                      <span className="font-semibold text-gray-900">{carInfo.carType || 'دیارینەکراوە'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مۆدێل:</span>
                      <span className="font-semibold text-gray-900">{carInfo.model || 'دیارینەکراوە'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">کیلۆمەتر:</span>
                      <span className="font-semibold text-gray-900">{carInfo.kilometers ? `${Number(carInfo.kilometers).toLocaleString()} کم` : 'دیارینەکراوە'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ژمارەی شاسی:</span>
                      <span className="font-semibold text-gray-900 font-mono text-xs">{carInfo.chassisNumber || 'دیارینەکراوە'}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between">
                      <span className="text-gray-600">خاوەن:</span>
                      <span className="font-semibold text-gray-900">{carInfo.fullName || 'دیارینەکراوە'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تەلەفۆن:</span>
                      <span className="font-semibold text-gray-900 font-mono">{carInfo.phoneNumber || 'دیارینەکراوە'}</span>
                    </div>
                  </div>
                </div>

                {carInfo.details && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      وردەکاری زیاتریش
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{carInfo.details}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    ئاماری زیانەکان
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ژمارەی ناوچەکان:</span>
                      <span className="font-semibold text-gray-900">{paths[fullscreenView].filter(p => p.color !== 'eraser').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">هێڵی ئازاد:</span>
                      <span className="font-semibold text-gray-900">{paths[fullscreenView].filter(p => p.type === 'freehand' || !p.type).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">بازنەکان:</span>
                      <span className="font-semibold text-gray-900">{paths[fullscreenView].filter(p => p.type === 'circle').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ناوچە پڕکراوەکان:</span>
                      <span className="font-semibold text-gray-900">{paths[fullscreenView].filter(p => p.type === 'fill').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">شێوە هەندەسییەکان:</span>
                      <span className="font-semibold text-gray-900">{paths[fullscreenView].filter(p => p.type === 'shape').length}</span>
                    </div>
                    {colors.slice(0, -1).map(color => {
                      const count = paths[fullscreenView].filter(path => path.color === color.color).length;
                      if (count > 0) {
                        return (
                          <div key={color.color} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.color }}
                              ></div>
                              <span className="text-gray-600">{color.name}:</span>
                            </div>
                            <span className="font-semibold text-gray-900">{count}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* ئامرازەکانی وێنەکێشان لە شاشەی پڕدا */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    ئامرازەکانی وێنەکێشان
                  </h3>
                  
                  {/* هەڵبژاردنی ئامراز */}
                  <div className="mb-4">
                    <label className="text-sm font-bold text-gray-700 block mb-2">ئامراز:</label>
                    <div className="space-y-2">
                      {drawingTools.map((tool) => (
                        <button
                          key={tool.mode}
                          onClick={() => setDrawingMode(tool.mode)}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 w-full text-sm ${
                            drawingMode === tool.mode 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span>{tool.icon}</span>
                          <span className="font-semibold text-gray-700">{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {colors.map((colorOption) => (
                      <button
                        key={colorOption.name}
                        onClick={() => setCurrentColor(colorOption.color)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 w-full ${
                          currentColor === colorOption.color 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border shadow-sm flex items-center justify-center"
                          style={{ 
                            backgroundColor: colorOption.color === 'eraser' ? '#f3f4f6' : colorOption.color, 
                            border: colorOption.color === 'eraser' ? '2px solid #ef4444' : '2px solid rgba(0,0,0,0.1)' 
                          }}
                        >
                          {colorOption.color === 'eraser' && <span className="text-red-500 text-xs">🗑️</span>}
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">{colorOption.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label className="text-sm font-bold text-gray-700 block mb-2">قەبارەی ئامراز: {brushSize}px</label>
                    <input
                      type="range"
                      min="2"
                      max="25"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* ناوچەی کەنڤاس */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-2xl">
                  <canvas
                    ref={fullscreenCanvasRef}
                    width={Math.min(window.innerWidth * 0.6, 1000)}
                    height={Math.min(window.innerHeight * 0.6, 600)}
                    onMouseDown={(e) => startDrawing(e, fullscreenView, true)}
                    onMouseMove={(e) => draw(e, fullscreenView, true)}
                    onMouseUp={() => stopDrawing(fullscreenView)}
                    onMouseLeave={() => stopDrawing(fullscreenView)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const canvas = fullscreenCanvasRef.current;
                      const mouseEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        target: canvas
                      };
                      startDrawing(mouseEvent, fullscreenView, true);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      if (!isDrawing && !isErasing && !isDrawingCircle) return;
                      const touch = e.touches[0];
                      const canvas = fullscreenCanvasRef.current;
                      const mouseEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        target: canvas
                      };
                      draw(mouseEvent, fullscreenView, true);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      stopDrawing(fullscreenView);
                    }}
                    className={`touch-none ${
                      drawingMode === 'circle' || drawingMode === 'filled-circle' ||
                      drawingMode === 'rectangle' || drawingMode === 'filled-rectangle' ||
                      drawingMode === 'triangle' || drawingMode === 'filled-triangle'
                        ? 'cursor-crosshair' 
                        : drawingMode === 'fill'
                          ? 'cursor-pointer'
                          : currentColor === 'eraser' 
                            ? 'cursor-not-allowed' 
                            : 'cursor-crosshair'
                    }`}
                  />
                  
                  {/* نیشاندەری چالاکی */}
                  {activeCard === fullscreenView && (isDrawing || isErasing || isDrawingCircle || isDrawingShape) && (
                    <div className={`absolute top-4 left-4 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg ${
                      isErasing ? 'bg-red-600' : 
                      isDrawingCircle ? 'bg-purple-600' : 
                      isDrawingShape ? (
                        drawingMode.includes('rectangle') ? 'bg-orange-600' : 'bg-orange-600'
                      ) :
                      drawingMode === 'fill' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {isErasing ? '🗑️ سڕینەوەی جێبەجێ...' : 
                       isDrawingCircle ? '⭕ کشانی بازنە...' : 
                       isDrawingShape ? (
                         drawingMode.includes('rectangle') ? '⬜ کشانی چوارگۆشە...' : '🔺 کشانی سێگۆشە...'
                       ) :
                       drawingMode === 'fill' ? '🪣 کلیک بکە بۆ پڕکردنەوە...' : '🎨 وێنەکێشان جێبەجێیە...'}
                    </div>
                  )}
                  
                  {/* دوگمەی سڕینەوەی هەموو وێنەکێشان */}
                  {paths[fullscreenView].filter(p => p.color !== 'eraser').length > 0 && (
                    <button 
                      onClick={() => clearView(fullscreenView)} 
                      className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg font-bold transition-all duration-200 hover:scale-110 shadow-lg"
                      title="سڕینەوەی هەموو وێنەکێشان"
                    >
                      🧹 سڕینەوەی وێنەکێشان
                    </button>
                  )}

                  {/* نیشاندەری ئامرازی هەنووکە */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                    ئامراز: {drawingTools.find(t => t.mode === drawingMode)?.name} {drawingTools.find(t => t.mode === drawingMode)?.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          border: none;
        }
        .touch-none {
          touch-action: none;
        }
      `}</style>
    </div>
  );
};

export default CarDamageDrawing;