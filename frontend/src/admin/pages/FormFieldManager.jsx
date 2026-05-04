import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig, resetConfig } from '../../api/leadsApi';

/**
 * Admin interface for controlling form field visibility.
 * 
 * STRICT REQUIREMENTS:
 * - NO adding new fields (fixed schema)
 * - NO deleting fields (fixed schema)
 * - Admin can ONLY toggle: visible, required, order
 */
export default function FormFieldManager() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const configFields = await getConfig();
      
      // Sort by order
      configFields.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      setFields(configFields);
      setError(null);
    } catch (err) {
      setError('Failed to load field configurations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (index) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], visible: !newFields[index].visible };
    setFields(newFields);
  };

  const toggleRequired = (index) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], required: !newFields[index].required };
    setFields(newFields);
  };

  const moveField = (index, direction) => {
    const newFields = [...fields];
    const targetIndex = index + direction;
    
    if (targetIndex >= 0 && targetIndex < newFields.length) {
      // Swap orders
      const tempOrder = newFields[index].order;
      newFields[index] = { ...newFields[index], order: newFields[targetIndex].order };
      newFields[targetIndex] = { ...newFields[targetIndex], order: tempOrder };
      
      // Swap positions
      const temp = newFields[index];
      newFields[index] = newFields[targetIndex];
      newFields[targetIndex] = temp;
      
      setFields(newFields);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Prepare updates for API (only visible, required, order allowed)
      const fieldUpdates = fields.map(field => ({
        key: field.key,
        visible: field.visible,
        required: field.required,
        order: field.order,
      }));

      const result = await updateConfig(fieldUpdates);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || 'Failed to save configuration');
      }
    } catch (err) {
      setError('Failed to save configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all field configurations to defaults?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const result = await resetConfig();
      
      if (result.success) {
        await loadFields();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || 'Failed to reset configuration');
      }
    } catch (err) {
      setError('Failed to reset configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderFieldRow = (field, index) => (
    <div key={field.key} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center gap-4">
        {/* Order number */}
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
          {field.order || index + 1}
        </div>

        {/* Visibility toggle */}
        <button
          onClick={() => toggleVisibility(index)}
          className={`p-2 rounded-lg transition-colors ${
            field.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}
          title={field.visible ? 'Hide field' : 'Show field'}
        >
          <i className={`fas ${field.visible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
        </button>

        {/* Field info - READ ONLY */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{field.label}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {field.key}
            </span>
            <span className="text-xs text-gray-400">{field.type}</span>
            {field.inputType && (
              <span className="text-xs text-gray-400">({field.inputType})</span>
            )}
          </div>
          {field.placeholder && (
            <div className="text-sm text-gray-500 mt-1">{field.placeholder}</div>
          )}
        </div>

        {/* Type badge */}
        <div className="w-20 text-center">
          <span className={`text-xs px-2 py-1 rounded ${
            field.type === 'input' ? 'bg-blue-100 text-blue-700' :
            field.type === 'select' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {field.type}
          </span>
        </div>

        {/* Required toggle */}
        <button
          onClick={() => toggleRequired(index)}
          className={`p-2 rounded-lg transition-colors ${
            field.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
          }`}
          title={field.required ? 'Make optional' : 'Make required'}
        >
          <i className={`fas ${field.required ? 'fa-asterisk' : 'fa-circle'}`}></i>
        </button>

        {/* Reorder buttons */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => moveField(index, -1)}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-up"></i>
          </button>
          <button
            onClick={() => moveField(index, 1)}
            disabled={index === fields.length - 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>

      {/* Options display for select fields */}
      {field.type === 'select' && field.options && field.options.length > 0 && (
        <div className="mt-3 ml-12">
          <label className="block text-xs font-medium text-gray-500 mb-1">Options (read-only)</label>
          <div className="flex flex-wrap gap-2">
            {field.options.map((opt, optIdx) => (
              <span key={optIdx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {opt.label} ({opt.value})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-yellow-400"></i>
            <p className="mt-4 text-gray-600">Loading field configurations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Form Field Manager
          </h1>
          <p className="text-gray-600">
            Control field visibility and order. Fields are fixed - you cannot add or delete them.
          </p>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <i className="fas fa-check-circle mr-2"></i>
            Configuration saved successfully!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{fields.length}</div>
            <div className="text-sm text-gray-500">Total Fields</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {fields.filter(f => f.visible).length}
            </div>
            <div className="text-sm text-gray-500">Visible</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {fields.filter(f => f.required).length}
            </div>
            <div className="text-sm text-gray-500">Required</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {fields.filter(f => f.type === 'select').length}
            </div>
            <div className="text-sm text-gray-500">Select Fields</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={saveConfiguration}
            disabled={saving}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-dark font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <><i className="fas fa-spinner fa-spin"></i> Saving...</>
            ) : (
              <><i className="fas fa-save"></i> Save Configuration</>
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i className="fas fa-undo"></i> Reset to Defaults
          </button>
          <button
            onClick={loadFields}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i className="fas fa-sync"></i> Refresh
          </button>
        </div>

        {/* Fields list - Fixed, no add/delete */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-list"></i>
            Form Fields ({fields.length}) - Fixed Schema
          </h2>
          
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-inbox text-4xl mb-4"></i>
              <p>No fields configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => renderFieldRow(field, index))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            How it works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Visibility</strong>: Toggle to show/hide fields in the form</li>
            <li>• <strong>Required</strong>: Mark fields as mandatory</li>
            <li>• <strong>Reorder</strong>: Drag fields using the up/down arrows</li>
            <li>• <strong>Fixed schema</strong>: Fields cannot be added or deleted</li>
            <li>• <strong>Save</strong>: Persist your configuration changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
