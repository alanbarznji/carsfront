import React from 'react'

const CarViewCard = ({ view, paths, images, activeCard, setActiveCard, startDrawing, draw, stopDrawing, openFullscreen, handleImageUpload, clearView, removeImage, fileInputRefs, canvasRefs, errors }) => (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl ${
      activeCard === view.id ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'
    } ${errors[view.id] ? 'border-red-300 ring-4 ring-red-100' : ''}`}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                        <span className="text-2xl">{view.icon}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {view.name}
                          <span className="text-red-500 ml-1">*</span>
                        </h3>
                        <p className="text-gray-600">{view.description}</p>
                        {errors[view.id] && <p className="text-red-500 text-sm mt-1">{errors[view.id]}</p>}
                    </div>
                </div>
                <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                      images[view.id] ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                        {images[view.id] ? '✅ صورة محملة' : '❌ لا توجد صورة'}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800 border-2 border-blue-200">
                        {paths[view.id].length} منطقة ضرر
                    </span>
                </div>
            </div>
        </div>

        <div className="p-6">
            <div className="relative mb-6">
                <div className="relative bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    <canvas
                        ref={el => canvasRefs.current[view.id] = el}
                        width={400}
                        height={300}
                        onMouseDown={(e) => {
                            setActiveCard(view.id);
                            startDrawing(e, view.id);
                        }}
                        onMouseMove={(e) => draw(e, view.id)}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setActiveCard(view.id);
                          const touch = e.touches[0];
                          const canvas = canvasRefs.current[view.id];
                          const mouseEvent = {
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            target: canvas
                          };
                          startDrawing(mouseEvent, view.id);
                        }}
                        onTouchMove={(e) => {
                          e.preventDefault();
                          if (!draw) return;
                          const touch = e.touches[0];
                          const canvas = canvasRefs.current[view.id];
                          const mouseEvent = {
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            target: canvas
                          };
                          draw(mouseEvent, view.id);
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            stopDrawing();
                        }}
                        className="w-full h-full cursor-crosshair touch-none"
                        style={{ minHeight: '300px' }}
                    />
                    {images[view.id] && (
                        <button 
                            onClick={() => openFullscreen(view.id)} 
                            className="absolute top-3 left-3 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110" 
                            title="فتح في الشاشة الكاملة"
                        >
                            🔍
                        </button>
                    )}
                </div>
                {activeCard === view.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        🎯 جاهز للرسم - انقر واسحب لتحديد الضرر
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3">
                <input
                    ref={el => fileInputRefs.current[view.id] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(view.id, e.target.files[0])}
                    className="hidden"
                />
                <button 
                    onClick={() => fileInputRefs.current[view.id]?.click()} 
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    📁 <span className="hidden sm:inline">اختر صورة</span>
                </button>
                <button 
                    onClick={() => clearView(view.id)} 
                    disabled={paths[view.id].length === 0} 
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    🧹 <span className="hidden sm:inline">مسح الرسم</span>
                </button>
                <button 
                    onClick={() => removeImage(view.id)} 
                    disabled={!images[view.id]} 
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    🗑️ <span className="hidden sm:inline">حذف الصورة</span>
                </button>
            </div>
        </div>
    </div>
);

export default CarViewCard
