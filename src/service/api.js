// ملف: src/services/api.js
// خدمة API للتواصل مع الـ backend

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("authToken");
  }

  // إعداد headers
  getHeaders(contentType = "application/json") {
    const headers = {
      "Content-Type": contentType,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // معالجة الاستجابة
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "حدث خطأ في الشبكة");
    }
    return await response.json();
  }

  // === وظائف تقارير الأضرار ===

  // إنشاء تقرير جديد
  async createDamageReport(reportData) {
    const response = await fetch(`${this.baseURL}/reports`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(reportData),
    });
    return this.handleResponse(response);
  }

  // جلب جميع التقارير
  async getDamageReports(page = 1, limit = 10) {
    const response = await fetch(
      `${this.baseURL}/reports?page=${page}&limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // جلب تقرير محدد
  async getDamageReport(reportId) {
    const response = await fetch(`${this.baseURL}/reports/${reportId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // تحديث تقرير
  async updateDamageReport(reportId, reportData) {
    const response = await fetch(`${this.baseURL}/reports/${reportId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(reportData),
    });
    return this.handleResponse(response);
  }

  // حذف تقرير
  async deleteDamageReport(reportId) {
    const response = await fetch(`${this.baseURL}/reports/${reportId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // رفع صورة لمنظر معين
  async uploadCarImage(reportId, viewType, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${this.baseURL}/reports/${reportId}/images/${viewType}`,
      {
        method: "POST",
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : undefined,
        },
        body: formData,
      }
    );
    return this.handleResponse(response);
  }

  // حفظ مسارات الأضرار
  async saveDamagePaths(reportId, viewType, paths) {
    const response = await fetch(
      `${this.baseURL}/reports/${reportId}/damage-paths/${viewType}`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ paths }),
      }
    );
    return this.handleResponse(response);
  }

  // حذف صورة
  async deleteCarImage(reportId, viewType) {
    const response = await fetch(
      `${this.baseURL}/reports/${reportId}/images/${viewType}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // === وظائف البحث ===

  // البحث العام
  async searchReports(query, page = 1, limit = 10) {
    const response = await fetch(
      `${this.baseURL}/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // البحث بالشاسيه
  async searchByChassisNumber(chassisNumber) {
    const response = await fetch(
      `${this.baseURL}/search/chassis/${encodeURIComponent(chassisNumber)}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // البحث برقم الهاتف
  async searchByPhoneNumber(phoneNumber) {
    const response = await fetch(
      `${this.baseURL}/search/phone/${encodeURIComponent(phoneNumber)}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // البحث المتقدم
  async advancedSearch(searchCriteria) {
    const response = await fetch(`${this.baseURL}/search/advanced`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(searchCriteria),
    });
    return this.handleResponse(response);
  }

  // الإحصائيات
  async getSearchStats() {
    const response = await fetch(`${this.baseURL}/search/stats`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // === وظائف المصادقة (اختيارية) ===

  // تسجيل الدخول
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    const result = await this.handleResponse(response);

    if (result.success && result.data.token) {
      this.token = result.data.token;
      localStorage.setItem("authToken", this.token);
    }

    return result;
  }

  // تسجيل مستخدم جديد
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // تسجيل الخروج
  logout() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // التحقق من الرمز المميز
  async verifyToken() {
    if (!this.token) return { success: false };

    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      this.logout();
      return { success: false };
    }
  }
}

export default new ApiService();

// ملف: src/hooks/useDamageReports.js
// Custom hook لإدارة تقارير الأضرار

import { useState, useEffect, useCallback } from "react";
import ApiService from "../services/api";

export const useDamageReports = () => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
  });

  // جلب جميع التقارير
  const fetchReports = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getDamageReports(page, limit);
      if (response.success) {
        setReports(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || "فشل في جلب التقارير");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // جلب تقرير محدد
  const fetchReport = useCallback(async (reportId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getDamageReport(reportId);
      if (response.success) {
        setCurrentReport(response.data);
        return response.data;
      } else {
        setError(response.message || "فشل في جلب التقرير");
        return null;
      }
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // إنشاء تقرير جديد
  const createReport = useCallback(
    async (reportData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiService.createDamageReport(reportData);
        if (response.success) {
          // إعادة تحميل التقارير
          await fetchReports();
          return response.data;
        } else {
          setError(response.message || "فشل في إنشاء التقرير");
          return null;
        }
      } catch (error) {
        setError(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchReports]
  );

  // رفع صورة
  const uploadImage = useCallback(
    async (reportId, viewType, imageFile) => {
      setError(null);
      try {
        const response = await ApiService.uploadCarImage(
          reportId,
          viewType,
          imageFile
        );
        if (response.success) {
          // تحديث التقرير الحالي
          if (currentReport && currentReport.id === reportId) {
            await fetchReport(reportId);
          }
          return response.data;
        } else {
          setError(response.message || "فشل في رفع الصورة");
          return null;
        }
      } catch (error) {
        setError(error.message);
        return null;
      }
    },
    [currentReport, fetchReport]
  );

  // حفظ مسارات الأضرار
  const savePaths = useCallback(async (reportId, viewType, paths) => {
    setError(null);
    try {
      const response = await ApiService.saveDamagePaths(
        reportId,
        viewType,
        paths
      );
      if (response.success) {
        return true;
      } else {
        setError(response.message || "فشل في حفظ مسارات الأضرار");
        return false;
      }
    } catch (error) {
      setError(error.message);
      return false;
    }
  }, []);

  // تحميل التقارير عند التحميل الأول
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    currentReport,
    loading,
    error,
    pagination,
    fetchReports,
    fetchReport,
    createReport,
    uploadImage,
    savePaths,
    setError,
  };
};

// مثال على الاستخدام في المكون الرئيسي
export const useCarDamageApp = () => {
  const {
    currentReport,
    loading,
    error,
    fetchReport,
    createReport,
    uploadImage,
    savePaths,
  } = useDamageReports();

  // إنشاء تقرير جديد مع البيانات من الـ form
  const handleCreateReport = async (carInfo) => {
    const reportData = {
      carType: carInfo.carType,
      chassisNumber: carInfo.chassisNumber,
      model: carInfo.model,
      fullName: carInfo.fullName,
      phoneNumber: carInfo.phoneNumber,
    };

    const newReport = await createReport(reportData);
    return newReport;
  };

  // رفع صورة لمنظر معين
  const handleImageUpload = async (reportId, viewId, file) => {
    if (file && file.type.startsWith("image/")) {
      const result = await uploadImage(reportId, viewId, file);
      return result;
    }
    return null;
  };

  // حفظ مسارات الرسم
  const handleSavePaths = async (reportId, viewId, paths) => {
    if (paths && paths.length > 0) {
      const success = await savePaths(reportId, viewId, paths);
      return success;
    }
    return true;
  };

  return {
    currentReport,
    loading,
    error,
    handleCreateReport,
    handleImageUpload,
    handleSavePaths,
    fetchReport,
  };
};
