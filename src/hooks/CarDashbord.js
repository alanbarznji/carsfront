import React, { useState, useEffect } from "react";
 
import { useDispatch, useSelector } from "react-redux";
import { DeletecarsAction, GetcarsAction } from "../Redux/Action/carsAction";
const UseCarDashbord = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(6);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Redux state and dispatch
  const dispatch = useDispatch();
  const {
    cars: carsFromRedux,
    loading,
    error,
  } = useSelector((state) => state.cars);

  // Load cars from Redux on component mount
  useEffect(() => {
    dispatch(GetcarsAction());
  }, [dispatch]);

  // Update filtered cars when Redux cars change
  useEffect(() => {
    if (carsFromRedux && Array.isArray(carsFromRedux)) {
      setFilteredCars(carsFromRedux);
    }
  }, [carsFromRedux]);

  // Search functionality with proper null checks
  useEffect(() => {
    if (!carsFromRedux || !Array.isArray(carsFromRedux)) {
      setFilteredCars([]);
      return;
    }

    const filtered = carsFromRedux.filter((car) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (car.chassis_number &&
          car.chassis_number.toLowerCase().includes(searchLower)) ||
        (car.car_type && car.car_type.toLowerCase().includes(searchLower)) ||
        (car.full_name && car.full_name.toLowerCase().includes(searchLower)) ||
        (car.phone_number &&
          car.phone_number.toLowerCase().includes(searchLower))
      );
    });

    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [searchTerm, carsFromRedux]);

  // Pagination calculations
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "مكتمل":
        return "bg-green-100 text-green-800 border-green-200";
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "جديد":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDamageColor = (damage) => {
    switch (damage) {
      case "شديد":
        return "bg-red-100 text-red-800 border-red-200";
      case "متوسط":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "طفيف":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleEdit = (car) => {
    setEditingCar({ ...car });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    // TODO: Add API call to update car in backend
    // Example: dispatch(updateCarAction(editingCar));

    // For now, just update the local state
    // Note: This should be handled by Redux actions in a real app
    setShowUpdateModal(false);
    setEditingCar(null);

    // Refresh the data after update
    dispatch(GetcarsAction());

    alert(`تم تحديث بيانات السيارة: ${editingCar.car_type} بنجاح`);
  };

  const handleUpdateChange = (field, value) => {
    setEditingCar((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (carId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السجل؟")) {
      // TODO: Add API call to delete car from backend
      // Example: dispatch(deleteCarAction(carId));

      // Refresh the data after deletion
      dispatch(DeletecarsAction(carId));
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  // Car image views configuration
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

  // Helper function to get image URL
  const getImageUrl = (imageName) => {
    if (!imageName) return null;
    return `http://localhost:5000/uploads/images/${imageName}`;
  };

  // Safe array access with default values
  const safeArray = carsFromRedux || [];

  return {
    safeArray,
    searchTerm,
    setSearchTerm,
    filteredCars,
    setFilteredCars,
    selectedCar,
    setSelectedCar,
    showModal,
    setShowModal,
    currentPage,
    setCurrentPage,
    carsPerPage,
    selectedImage,
    setSelectedImage,
    showUpdateModal,
    setShowUpdateModal,
    editingCar,
    setEditingCar,
    dispatch,
    carsFromRedux,
    loading,
    error,
    indexOfLastCar,
    indexOfFirstCar,
    currentCars,
    totalPages,
    getStatusColor,
    getDamageColor,
    handleViewDetails,
    handleEdit,
    handleUpdateSubmit,
    handleUpdateChange,
    handleDelete,
    handleSearch,
    getImageUrl,
    views,
  };
};

export default UseCarDashbord;
