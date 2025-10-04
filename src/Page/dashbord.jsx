import React, { useState, useEffect } from "react";
import {
  Search,
  Car,
  Calendar,
  Phone,
  User,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Gauge,
  ArrowLeft,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import UseCarDashbord from "../hooks/CarDashbord";
import { useDispatch, useSelector } from "react-redux";
import { DeletecarsAction, GetcarsAction } from "../Redux/Action/carsAction";

const CarDashboard = () => {
  const {
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
  } = UseCarDashbord();
// http://localhost:5000/uploads/images/
  const [showPdfModal, setShowPdfModal] = useState(false);
const [pdfUrl, setPdfUrl] = useState(null);

// If you already have a URL on the car (e.g., car.pdf_url), use it.
// Otherwise, build an API path you expose from your backend.
const resolvePdfUrl = (car) =>
  car?.pdf_url || `/api/cars/${car?.id}/report.pdf`;
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">زانیارییەکان لەباردەکرێن…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-600 mb-4">
            <FileText size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">هەڵە لە بارکردنی داتا</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(GetcarsAction())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            هەوڵدانەوە
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6" dir="rtl">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Car className="text-blue-600" size={40} />
              تابلۆی کۆنترۆڵی ئۆتۆمبێلەکان
            </h1>
            <p className="text-gray-600 mt-2">گەڕان و بەڕێوەبردنی تۆمارەکانی زیانی ئۆتۆمبێلەکان</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location = "/")}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <SearchBar searchTerm={searchTerm} hundle={handleSearch} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">کۆی گشتی ئۆتۆمبێلەکان</p>
              <p className="text-3xl font-bold text-blue-600">{safeArray.length}</p>
            </div>
            <Car className="text-blue-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">ئۆتۆمبێلە زیادکراوەکانی ئەمڕۆ</p>
              <p className="text-3xl font-bold text-green-600">
                {
                  safeArray.filter((car) => {
                    const today = new Date().toDateString();
                    return new Date(car.created_at).toDateString() === today;
                  }).length
                }
              </p>
            </div>
            <FileText className="text-green-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">کۆی گشتی مەسافە</p>
              <p className="text-3xl font-bold text-purple-600">
                {safeArray.reduce((total, car) => total + (car.km || 0), 0).toLocaleString()} کیلۆمەتر
              </p>
            </div>
            <Gauge className="text-purple-600" size={40} />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          پیشاندانی {currentCars.length} لە {filteredCars.length} تۆمار
          {searchTerm && ` (گەڕان بۆ: "${searchTerm}")`}
        </p>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {currentCars.map((car) => (
          <div key={car.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{car.car_type || "دیارینەکراوە"}</h3>
                <p className="text-gray-600 text-sm mb-1">مۆدێل {car.model || "دیارینەکراوە"}</p>
                <p className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {car.chassis_number || "دیارینەکراوە"}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={16} />
                <span className="text-gray-700">{car.full_name || "دیارینەکراوە"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={16} />
                <span className="text-gray-700">{car.phone_number || "دیارینەکراوە"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="text-gray-400" size={16} />
                <span className="text-gray-700">مەسافە: {car.km ? `${car.km} کیلۆمەتر` : "دیارینەکراوە"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={16} />
                <span className="text-gray-700">
                  دواین نوێکردنەوە: {car.updated_at ? new Date(car.updated_at).toLocaleDateString("ckb-IQ") : "دیارینەکراوە"}
                </span>
              </div>
            </div>

            {car.details && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 line-clamp-2">{car.details}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleViewDetails(car)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
              >
                <Eye size={16} />
                پیشاندانی وردەکاری
              </button>
              <button
                onClick={() => handleEdit(car)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(car.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            پێشووتر
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            دواتر
          </button>
        </div>
      )}

      {/* Modal for car details */}
      {showModal && selectedCar && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">وردەکاریی ئۆتۆمبێل</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Car Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">جۆری ئۆتۆمبێل</label>
                        <p className="text-lg text-gray-900">{selectedCar.car_type || "دیارینەکراوە"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">مۆدێل</label>
                        <p className="text-lg text-gray-900">{selectedCar.model || "دیارینەکراوە"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">ژمارەی شاسی</label>
                        <p className="text-lg text-gray-900 font-mono bg-gray-100 p-2 rounded">{selectedCar.chassis_number || "دیارینەکراوە"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">ناوی خاوەن</label>
                        <p className="text-lg text-gray-900">{selectedCar.full_name || "دیارینەکراوە"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">ژمارەی تەلەفۆن</label>
                        <p className="text-lg text-gray-900">{selectedCar.phone_number || "دیارینەکراوە"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">مەسافە</label>
                        <p className="text-lg text-gray-900">{selectedCar.km || "دیارینەکراوە"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">کورتە</h3>
                    <div className="flex justify-between items-center ">
                      <div className="w-[300px]">
                        <p className="text-sm d-flex w-[100px] text-gray-500">دۆخی ڕاپۆرت</p>
                        <p className="whitespace-normal break-words">{selectedCar.details || "دیارینەکراوە"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car Images */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">وێنەکانی ئۆتۆمبێل</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {views.map((view) => {
                      const imageUrl = getImageUrl(selectedCar[view.id]);
                      return (
                        <div key={view.id} className="relative">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={view.name}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                onClick={() =>
                                  setSelectedImage({
                                    src: imageUrl,
                                    title: view.name,
                                    description: view.description,
                                  })
                                }
                                onError={(e) => {
                                  console.error("Image failed to load:", imageUrl);
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="text-2xl mb-2">{view.icon}</span>
                                <span className="text-xs text-center px-2">وێنە بوونی نییە</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 text-center">{view.name}</p>
                            <p className="text-xs text-gray-500 text-center">{view.description}</p>
                            {imageUrl && (
                              <div className="flex justify-center mt-1">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
 <button
  onClick={() => {
    const url = "http://localhost:5000/uploads/PDF/"+selectedCar.pdf;
    setPdfUrl(url);
    setShowPdfModal(true);
  }}
  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
>
  PDF
</button>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  داخستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{showPdfModal && pdfUrl && (
  <div
    className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
    onKeyDown={(e) => e.key === "Escape" && setShowPdfModal(false)}
    role="dialog"
    aria-modal="true"
  >
    <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">پیشاندانی PDF</h3>
        <div className="flex items-center gap-2">
          {/* Download */}
          <a
            href={pdfUrl}
            download
            className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            داگرتن
          </a>
          {/* Open in new tab (print-ready) */}
          <button
            onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
            className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            کردنەوە لەتابی نوێ
          </button>
          {/* Close */}
          <button
            onClick={() => setShowPdfModal(false)}
            className="w-10 h-10 rounded-full bg-red-600 text-white font-bold"
            aria-label="Close PDF"
            title="داخستن"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="w-full h-[85vh]">
        {/* Use iframe (simplest & most compatible) */}
        <iframe
          title="PDF Viewer"
          src={`${pdfUrl} `}
          className="w-full h-full"
          loading="eager"
        />
        {/* If you prefer <object>, you can swap the block above with: 
        <object data={pdfUrl} type="application/pdf" className="w-full h-full">
          <p className="p-4 text-sm">
            ناتوانرێت PDF پیشانبدرێت. تکایە
            <a className="text-blue-600 underline mx-1" href={pdfUrl} target="_blank" rel="noreferrer">ئەم بەستەرە</a>
            بکەرەوە.
          </p>
        </object> */}
       
      </div>
    </div>
  </div>
)}
      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <div className="mb-4 text-center">
              <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300 text-sm">{selectedImage.description}</p>
            </div>
            <div className="relative bg-white rounded-lg overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[70vh]"
                onError={(e) => {
                  console.error("Full screen image failed to load:", selectedImage.src);
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkڕاوە: وێنە نەتوانرا بخەیتەوە</text></svg>";
                }}
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "ئەنجامێک بۆ گەڕان نەدۆزرایەوە" : "هیچ ئۆتۆمبێلێک نییە"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? `هیچ ئۆتۆمبێلێک کە گونجاو بێت لەگەڵ گەڕانتدا نەدۆزرایەوە \"${searchTerm}\"`
              : "هێشتا هیچ ئۆتۆمبێلێک زیاد نەکراوە"}
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              سڕینەوەی گەڕان
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CarDashboard;