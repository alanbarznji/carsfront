import React from 'react'

const CarInfoForm = ({ carInfo, handleCarInfoChange, errors }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 hover:shadow-2xl transition-all duration-300" dir="rtl">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
        <span className="text-2xl">📋</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">زانیاریی ئۆتۆمبێل و خاوەن</h2>
        <p className="text-gray-600">زانیاریی سەرەتاییەکانی ئۆتۆمبێل داخل بکە</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          جۆری ئۆتۆمبێل <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={carInfo.carType}
          onChange={(e) => handleCarInfoChange('carType', e.target.value)}
          placeholder="وەڵێ: تۆیۆتا کامری"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
            errors.carType ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.carType && <p className="text-red-500 text-sm mt-1">{errors.carType}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          ژمارەی شاسی (VIN) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={carInfo.chassisNumber}
          onChange={(e) => handleCarInfoChange('chassisNumber', e.target.value)}
          placeholder="ژمارەی ناسینەوەی ئۆتۆمبێل"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 font-mono ${
            errors.chassisNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.chassisNumber && <p className="text-red-500 text-sm mt-1">{errors.chassisNumber}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          مۆدێلی ئۆتۆمبێل <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={carInfo.model}
          onChange={(e) => handleCarInfoChange('model', e.target.value)}
          placeholder="وەڵێ: 2024"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
            errors.model ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          ناوی تەواو <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={carInfo.fullName}
          onChange={(e) => handleCarInfoChange('fullName', e.target.value)}
          placeholder="ناوی تەواوی خاوەن"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
            errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
      </div>
      
      <div className="space-y-2 ">
        <label className="block text-sm font-semibold text-gray-700">
          ژمارەی تەلەفۆن <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={carInfo.phoneNumber}
          onChange={(e) => handleCarInfoChange('phoneNumber', e.target.value)}
          placeholder="07xxxxxxxxx"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
            errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          ژمارەی کیلۆمەتر <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={carInfo.kilometers}
          onChange={(e) => handleCarInfoChange('kilometers', e.target.value)}
          placeholder="وەڵێ: 50000"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
            errors.kilometers ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers}</p>}
      </div>

      <div className="space-y-2 ">
        <label className="block text-sm font-semibold text-gray-700">
          وردەکاری زیادە
        </label>
        <textarea
          value={carInfo.details}
          onChange={(e) => handleCarInfoChange('details', e.target.value)}
          placeholder="هەر وردەکارییەکی تر دەربارەی ئۆتۆمبێل یان زیانەکان..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  </div>
);
export default CarInfoForm
