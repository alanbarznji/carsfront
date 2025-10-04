import React from 'react'

const DrawingTools = ({ colors, currentColor, setCurrentColor, brushSize, setBrushSize }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-r from-pink-500 to-orange-600 p-3 rounded-xl">
        <span className="text-2xl">🎨</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">أدوات الرسم والتحكم</h2>
        <p className="text-gray-600">اختر نوع الضرر وحجم الفرشاة</p>
      </div>
    </div>

    {/* اختيار نوع الضرر */}
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        نوع الضرر
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {colors.map((colorOption) => (
          <button
            key={colorOption.name}
            onClick={() => setCurrentColor(colorOption.color)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              currentColor === colorOption.color 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div 
              className="w-6 h-6 rounded-full border-2 shadow-sm flex items-center justify-center"
              style={{ 
                backgroundColor: colorOption.color === 'eraser' ? '#f3f4f6' : colorOption.color, 
                border: colorOption.color === 'eraser' ? '2px solid #ef4444' : '2px solid rgba(0,0,0,0.1)' 
              }}
            >
              {colorOption.color === 'eraser' && <span className="text-red-500 text-xs font-bold">🗑️</span>}
            </div>
            <span className="font-semibold text-gray-700 text-sm">{colorOption.name}</span>
          </button>
        ))}
      </div>
    </div>

    {/* اختيار حجم الفرشاة */}
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        حجم الفرشاة
      </h3>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="text-center mb-4">
          <label className="text-lg font-bold text-gray-700">الحجم: {brushSize} بكسل</label>
        </div>
        <input
          type="range"
          min="2"
          max="25"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-300 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-center mt-6">
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 text-center">معاينة الفرشاة</p>
            <div
              className="mx-auto rounded-full shadow-sm border border-gray-200 transition-all duration-200 flex items-center justify-center"
              style={{
                width: `${Math.max(brushSize * 2, 16)}px`,
                height: `${Math.max(brushSize * 2, 16)}px`,
                backgroundColor: currentColor === 'eraser' ? '#f3f4f6' : currentColor,
                border: currentColor === 'eraser' ? '2px dashed #ef4444' : '2px solid rgba(0,0,0,0.1)'
              }}
            >
              {currentColor === 'eraser' && <span className="text-red-500 text-xs">🗑️</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DrawingTools
