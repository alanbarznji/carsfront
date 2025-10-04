import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { InsertcarsAction } from '../Redux/Action/carsAction';

const CardDamge = () => {
const dispatch = useDispatch();
const [activeCard, setActiveCard] = useState(null);
const [isDrawing, setIsDrawing] = useState(false);
const [isErasing, setIsErasing] = useState(false);
const [currentColor, setCurrentColor] = useState("#dc2626");
const [brushSize, setBrushSize] = useState(3);
const [fullscreenView, setFullscreenView] = useState(null);
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

const canvasRefs = useRef({});
const fullscreenCanvasRef = useRef(null);
const fileInputRefs = useRef({});

const [carInfo, setCarInfo] = useState({
  carType: "",
  chassisNumber: "",
  model: "",
  phoneNumber: "",
  fullName: "",
  kilometers: "",
  details: "",
});

const [images, setImages] = useState({
  front: null,
  back: null,
  left: null,
  right: null,
  top: null,
});

const [paths, setPaths] = useState({
  front: [],
  back: [],
  left: [],
  right: [],
  top: [],
});

const views = [
  {
    id: "front",
    name: "المنظر الأمامي",
    icon: "🚗",
    description: "المصد الأمامي والأضواء",
  },
  {
    id: "back",
    name: "المنظر الخلفي",
    icon: "🔙",
    description: "المصد الخلفي والأضواء",
  },
  {
    id: "left",
    name: "الجانب الأيسر",
    icon: "👈",
    description: "الأبواب والمرايا اليسرى",
  },
  {
    id: "right",
    name: "الجانب الأيمن",
    icon: "👉",
    description: "الأبواب والمرايا اليمنى",
  },
  {
    id: "top",
    name: "المنظر العلوي",
    icon: "🔝",
    description: "السقف والجزء العلوي",
  },
];

const colors = [
  { color: "#dc2626", name: "ضرر شديد" },
  { color: "#ea580c", name: "ضرر متوسط" },
  { color: "#eab308", name: "ضرر طفيف" },
  { color: "#16a34a", name: "خدوش" },
  { color: "#2563eb", name: "ملاحظات" },
  { color: "eraser", name: "ممحاة" },
];

const validateForm = () => {
  const newErrors = {};

  // Validate car info
  if (!carInfo.carType.trim()) {
    newErrors.carType = "نوع السيارة مطلوب";
  }

  if (!carInfo.chassisNumber.trim()) {
    newErrors.chassisNumber = "رقم الشاسيه مطلوب";
  } else if (carInfo.chassisNumber.trim().length < 10) {
    newErrors.chassisNumber = "رقم الشاسيه يجب أن يكون 10 أحرف على الأقل";
  }

  if (!carInfo.model.trim()) {
    newErrors.model = "موديل السيارة مطلوب";
  }

  if (!carInfo.fullName.trim()) {
    newErrors.fullName = "الاسم الكامل مطلوب";
  } else if (carInfo.fullName.trim().length < 3) {
    newErrors.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";
  }

  if (!carInfo.phoneNumber.trim()) {
    newErrors.phoneNumber = "رقم الهاتف مطلوب";
  } else if (!/^07\d{8}$/.test(carInfo.phoneNumber.trim())) {
    newErrors.phoneNumber = "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام";
  }

  if (!carInfo.kilometers.trim()) {
    newErrors.kilometers = "عدد الكيلومترات مطلوب";
  } else if (isNaN(carInfo.kilometers) || Number(carInfo.kilometers) < 0) {
    newErrors.kilometers = "يجب إدخال رقم صحيح للكيلومترات";
  }

  // Validate at least one image is uploaded
  const hasImages = Object.values(images).some((img) => img !== null);
  if (!hasImages) {
    views.forEach((view) => {
      newErrors[view.id] = "يجب تحميل صورة واحدة على الأقل";
    });
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleCarInfoChange = (field, value) => {
  setCarInfo((prev) => ({ ...prev, [field]: value }));
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }
};

const handleImageUpload = (viewId, file) => {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImages((prev) => ({ ...prev, [viewId]: img }));
        // Clear error when image is uploaded
        if (errors[viewId]) {
          setErrors((prev) => ({ ...prev, [viewId]: "" }));
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
  // Simple direct mapping - no scaling needed since we draw image to full canvas size
  return {
    x: ((e.clientX - rect.left) / rect.width) * canvas.width,
    y: ((e.clientY - rect.top) / rect.height) * canvas.height,
  };
};

const eraseAtPosition = (viewId, x, y) => {
  const eraserRadius = brushSize * 2; // Make eraser bigger than brush

  setPaths((prev) => {
    const updatedPaths = prev[viewId].filter((path) => {
      // Check if any point in the path is within eraser radius
      return !path.points.some((point) => {
        const distance = Math.sqrt(
          Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
        );
        return distance <= eraserRadius;
      });
    });

    return { ...prev, [viewId]: updatedPaths };
  });
};

const startDrawing = (e, viewId, isFullscreen = false) => {
  if (!images[viewId]) return; // Only allow drawing if image exists

  const canvas = isFullscreen
    ? fullscreenCanvasRef.current
    : canvasRefs.current[viewId];
  const { x, y } = getCanvasCoordinates(e, canvas);

  if (currentColor === "eraser") {
    setIsErasing(true);
    // Start erasing - remove paths that intersect with eraser position
    eraseAtPosition(viewId, x, y);
  } else {
    setIsDrawing(true);
    const newPath = {
      color: currentColor,
      size: brushSize,
      points: [{ x, y }],
    };

    setPaths((prev) => ({
      ...prev,
      [viewId]: [...prev[viewId], newPath],
    }));
  }
};

const draw = (e, viewId, isFullscreen = false) => {
  if ((!isDrawing && !isErasing) || !images[viewId]) return;

  const canvas = isFullscreen
    ? fullscreenCanvasRef.current
    : canvasRefs.current[viewId];
  const { x, y } = getCanvasCoordinates(e, canvas);

  if (currentColor === "eraser" && isErasing) {
    eraseAtPosition(viewId, x, y);
  } else if (isDrawing) {
    setPaths((prev) => {
      const currentPaths = [...prev[viewId]];
      if (currentPaths.length > 0) {
        currentPaths[currentPaths.length - 1].points.push({ x, y });
      }
      return { ...prev, [viewId]: currentPaths };
    });
  }
};

const stopDrawing = () => {
  setIsDrawing(false);
  setIsErasing(false);
};

const clearView = (viewId) => {
  setPaths((prev) => ({ ...prev, [viewId]: [] }));
};

const removeImage = (viewId) => {
  setImages((prev) => ({ ...prev, [viewId]: null }));
  clearView(viewId);
};

const redrawCanvas = (viewId, isFullscreen = false) => {
  const canvas = isFullscreen
    ? fullscreenCanvasRef.current
    : canvasRefs.current[viewId];
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (images[viewId]) {
    // Draw image to fill entire canvas
    ctx.drawImage(images[viewId], 0, 0, canvas.width, canvas.height);
  } else {
    // Create a beautiful gradient background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isFullscreen) {
      const view = views.find((v) => v.id === viewId);
      // Add a subtle border
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Center content
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText(view.icon, canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = "bold 18px Arial";
      ctx.fillText(
        'انقر "اختر صورة"',
        canvas.width / 2,
        canvas.height / 2 + 10
      );
      ctx.font = "16px Arial";
      ctx.fillText(
        "لتحميل صورة السيارة",
        canvas.width / 2,
        canvas.height / 2 + 35
      );
    }
  }

  // Draw paths - skip eraser paths as they are handled by removal
  paths[viewId].forEach((path) => {
    if (path.points.length < 2 || path.color === "eraser") return;

    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";

    // Add shadow for better visibility
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    path.points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });

  ctx.globalCompositeOperation = "source-over";
};

const handleSubmit = async () => {
  if (!validateForm()) {
    // Scroll to first error
    const firstError = document.querySelector(".border-red-500");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  setIsSubmitting(true);

  try {
    const formData = new FormData();

    // Add text fields
    formData.append("chassis_number", carInfo.chassisNumber);
    formData.append("model", carInfo.model);
    formData.append("full_name", carInfo.fullName);
    formData.append("phone_number", carInfo.phoneNumber);
    formData.append("car_type", carInfo.carType);
    formData.append("km", carInfo.kilometers);
    formData.append("details", carInfo.details);

    // Convert each canvas to blob and append to FormData
    const imagePromises = [];

    Object.entries(images).forEach(([viewId, image]) => {
      if (image && canvasRefs.current[viewId]) {
        const canvas = canvasRefs.current[viewId];

        const promise = new Promise((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                formData.append(viewId, blob, `${viewId}.png`);
              }
              resolve();
            },
            "image/png",
            0.9
          );
        });

        imagePromises.push(promise);
      }
    });

    // Wait for all canvas-to-blob conversions to complete
    await Promise.all(imagePromises);

    // Simulate API call (replace with actual dispatch)
    console.log("Sending data to backend...");
    console.log("Form data entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    await dispatch(InsertcarsAction(formData));

    alert("✅ تم إرسال البيانات بنجاح!");
  } catch (error) {
    console.error("Error:", error);
    alert("❌ حدث خطأ في إرسال البيانات");
  } finally {
    setIsSubmitting(false);
  }
};

useEffect(() => {
  views.forEach((view) => redrawCanvas(view.id));
  if (fullscreenView) {
    redrawCanvas(fullscreenView, true);
  }
}, [paths, images, fullscreenView, brushSize, currentColor]);
  return {
    activeCard,
    setActiveCard,
    isDrawing,
    setIsDrawing,
    isErasing,
    setIsErasing,
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
    fullscreenView,
    setFullscreenView,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    canvasRefs,
    fullscreenCanvasRef,
    fileInputRefs,
    carInfo,
    setCarInfo,
    images,
    setImages,
    paths,
    setPaths,
    views,
    colors,
    validateForm,
    handleCarInfoChange,
    handleImageUpload,
    openFullscreen,
    closeFullscreen,
    getCanvasCoordinates,
    eraseAtPosition,
    startDrawing,
    draw,
    stopDrawing,
    clearView,
    removeImage,
    redrawCanvas,
    handleSubmit,
  };
}

export default CardDamge
