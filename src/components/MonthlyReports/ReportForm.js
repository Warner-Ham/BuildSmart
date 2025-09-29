import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateMonthlyReport, useUpdateMonthlyReport } from '../../hooks/useMonthlyReports';
import { formatCurrency } from '../../services/api';
import { Save, X, AlertCircle } from 'lucide-react';

const ReportForm = ({ report = null, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  
  const createMutation = useCreateMonthlyReport();
  const updateMutation = useUpdateMonthlyReport();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      projectId: report?.projectId || '',
      reportYear: report?.reportYear || new Date().getFullYear(),
      reportMonth: report?.reportMonth || new Date().getMonth() + 1,
      totalMaterialsCost: report?.totalMaterialsCost || 0,
      totalLaborCost: report?.totalLaborCost || 0,
      totalMachineryCost: report?.totalMachineryCost || 0,
      totalLaborHours: report?.totalLaborHours || 0,
      totalMachineryHours: report?.totalMachineryHours || 0,
      workDays: report?.workDays || 0,
      productivityScore: report?.productivityScore || 0,
      notes: report?.notes || '',
    }
  });

  const watchedValues = watch();

  // Auto-calculate total cost when individual costs change
  useEffect(() => {
    if (autoCalculate) {
      const materials = parseFloat(watchedValues.totalMaterialsCost) || 0;
      const labor = parseFloat(watchedValues.totalLaborCost) || 0;
      const machinery = parseFloat(watchedValues.totalMachineryCost) || 0;
      const total = materials + labor + machinery;
      setValue('totalCost', total);
    }
  }, [watchedValues.totalMaterialsCost, watchedValues.totalLaborCost, watchedValues.totalMachineryCost, autoCalculate, setValue]);

  // Auto-calculate productivity score
  useEffect(() => {
    if (autoCalculate) {
      const laborHours = parseFloat(watchedValues.totalLaborHours) || 0;
      const machineryHours = parseFloat(watchedValues.totalMachineryHours) || 0;
      const workDays = parseFloat(watchedValues.workDays) || 1;
      
      if (workDays > 0) {
        const totalHours = laborHours + machineryHours;
        const avgDailyHours = totalHours / workDays;
        const productivity = Math.min(100, avgDailyHours * 10); // Simplified calculation
        setValue('productivityScore', productivity.toFixed(1));
      }
    }
  }, [watchedValues.totalLaborHours, watchedValues.totalMachineryHours, watchedValues.workDays, autoCalculate, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (report) {
        await updateMutation.mutateAsync({ id: report.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {report ? 'Edit Monthly Report' : 'Create Monthly Report'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Project ID *</label>
              <input
                {...register('projectId', { required: 'Project ID is required' })}
                type="number"
                className="input"
                placeholder="Enter project ID"
              />
              {errors.projectId && (
                <p className="text-red-500 text-sm mt-1">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <label className="label">Report Year *</label>
              <input
                {...register('reportYear', { 
                  required: 'Report year is required',
                  min: { value: 2020, message: 'Year must be 2020 or later' },
                  max: { value: 2030, message: 'Year must be 2030 or earlier' }
                })}
                type="number"
                className="input"
                min="2020"
                max="2030"
              />
              {errors.reportYear && (
                <p className="text-red-500 text-sm mt-1">{errors.reportYear.message}</p>
              )}
            </div>

            <div>
              <label className="label">Report Month *</label>
              <select
                {...register('reportMonth', { required: 'Report month is required' })}
                className="input"
              >
                <option value="">Select month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              {errors.reportMonth && (
                <p className="text-red-500 text-sm mt-1">{errors.reportMonth.message}</p>
              )}
            </div>
          </div>

          {/* Cost Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Cost Information</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoCalculate"
                  checked={autoCalculate}
                  onChange={(e) => setAutoCalculate(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoCalculate" className="text-sm text-gray-600">
                  Auto-calculate totals
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Materials Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    {...register('totalMaterialsCost', { 
                      min: { value: 0, message: 'Cost must be non-negative' }
                    })}
                    type="number"
                    step="0.01"
                    className="input pl-8"
                    placeholder="0.00"
                  />
                </div>
                {errors.totalMaterialsCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalMaterialsCost.message}</p>
                )}
              </div>

              <div>
                <label className="label">Labor Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    {...register('totalLaborCost', { 
                      min: { value: 0, message: 'Cost must be non-negative' }
                    })}
                    type="number"
                    step="0.01"
                    className="input pl-8"
                    placeholder="0.00"
                  />
                </div>
                {errors.totalLaborCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalLaborCost.message}</p>
                )}
              </div>

              <div>
                <label className="label">Machinery Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    {...register('totalMachineryCost', { 
                      min: { value: 0, message: 'Cost must be non-negative' }
                    })}
                    type="number"
                    step="0.01"
                    className="input pl-8"
                    placeholder="0.00"
                  />
                </div>
                {errors.totalMachineryCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalMachineryCost.message}</p>
                )}
              </div>
            </div>

            {/* Total Cost Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Cost:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(watchedValues.totalMaterialsCost + watchedValues.totalLaborCost + watchedValues.totalMachineryCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Hours and Productivity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hours and Productivity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="label">Labor Hours</label>
                <input
                  {...register('totalLaborHours', { 
                    min: { value: 0, message: 'Hours must be non-negative' }
                  })}
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="0.0"
                />
                {errors.totalLaborHours && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalLaborHours.message}</p>
                )}
              </div>

              <div>
                <label className="label">Machinery Hours</label>
                <input
                  {...register('totalMachineryHours', { 
                    min: { value: 0, message: 'Hours must be non-negative' }
                  })}
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="0.0"
                />
                {errors.totalMachineryHours && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalMachineryHours.message}</p>
                )}
              </div>

              <div>
                <label className="label">Work Days</label>
                <input
                  {...register('workDays', { 
                    min: { value: 0, message: 'Work days must be non-negative' }
                  })}
                  type="number"
                  className="input"
                  placeholder="0"
                />
                {errors.workDays && (
                  <p className="text-red-500 text-sm mt-1">{errors.workDays.message}</p>
                )}
              </div>

              <div>
                <label className="label">Productivity Score (%)</label>
                <input
                  {...register('productivityScore', { 
                    min: { value: 0, message: 'Score must be between 0-100' },
                    max: { value: 100, message: 'Score must be between 0-100' }
                  })}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="input"
                  placeholder="0.0"
                />
                {errors.productivityScore && (
                  <p className="text-red-500 text-sm mt-1">{errors.productivityScore.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              {...register('notes', { 
                maxLength: { value: 2000, message: 'Notes cannot exceed 2000 characters' }
              })}
              rows={4}
              className="input"
              placeholder="Additional notes about this monthly report..."
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Error Display */}
          {(createMutation.error || updateMutation.error) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">
                  {createMutation.error?.message || updateMutation.error?.message}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {report ? 'Update Report' : 'Create Report'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
