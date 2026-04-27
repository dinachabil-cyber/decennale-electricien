import React, { useState, useEffect } from 'react';
import { getAllFormSteps, getFieldOptions } from '../../config/formSchema';

/**
 * Admin interface for managing form field configurations.
 * Allows toggling visibility, editing labels, setting required fields,
 * and reordering fields without affecting database schema.
 */
export default function FormFieldManager() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from /api/leads/config
      const allFields = getAllFormSteps();
      setFields(allFields);
      setError(null);
    } catch (err) {
      setError('Failed to load field configurations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (index, updates) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const toggleVisibility = (index) => {
    const field = fields[index];
    handleFieldChange(index, { visible: !field.visible });
  };

  const toggleRequired = (index) => {
    const field = fields[index];
    handleFieldChange(index, { required: !field.required });
  };

  const moveField = (index, direction) => {
    const newFields = [...fields];
    const targetIndex = index + direction;
    
    if (targetIndex >= 0 && targetIndex < newFields.length) {
      const temp = newFields[index];
      newFields[index] = newFields[targetIndex];
      newFields[targetIndex] = temp;
      
      // Update order values
      newFields.forEach((field, idx) => {
        field.order = idx + 1;
      });
      
      setFields(newFields);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Prepare data for API
      const updates = fields.reduce((acc, field) => {
        acc[field.key] = {
          label: field.label,
          type: field.type,
          required: field.required,
          visible: field.visible,
          order: field.order,
          options: field.options,
          placeholder: field.placeholder,
          inputType: field.inputType,
        };
        return acc;
      }, {});

      // In production, send to backend API
      // const response = await fetch('/api/leads/config', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fields: Object.values(updates) }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!window.confirm('Reset all field configurations to defaults?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // In production, call reset endpoint
      // await fetch('/api/leads/config/reset', { method: 'POST' });
      
      // Reload fields
      await loadFields();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to reset configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderFieldEditor = (field, index) => (
    <div key={field.key} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center gap-4">
        {/* Drag handle */}
        <div className="text-gray-400 cursor-move">
          <i className="fas fa-grip-lines"></i>
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

        {/* Field info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{field.label}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {field.key}
            </span>
            <span className="text-xs text-gray-400">{field.type}</span>
          </div>
          
          {field.visible && (
            <div className="mt-2 space-y-2">
              {/* Label editor */}
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleFieldChange(index, { label: e.target.value })}
                placeholder="Field label"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />

              {/* Placeholder editor */}
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleFieldChange(index, { placeholder: e.target.value })}
                placeholder="Placeholder text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Field type selector */}
        <div className="w-32">
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, { type: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="tel">Phone</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="date">Date</option>
            <option value="datetime">Datetime</option>
          </select>
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

      {/* Options editor for select fields */}
      {field.type === 'select' && (
        <div className="mt-3 ml-10">
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <textarea
            value={JSON.stringify(field.options || [], null, 2)}
            onChange={(e) => {
              try {
                const options = JSON.parse(e.target.value);
                handleFieldChange(index, { options });
              } catch {
                // Invalid JSON, don't update
              }
            }}
            placeholder='[{"value": "option1", "label": "Option 1"}]'
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            rows={3}
          />
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
            Configure form fields dynamically. Changes affect visibility and validation 
            without modifying the database schema.
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
            onClick={resetToDefaults}
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

        {/* Fields list */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-list"></i>
            Form Fields ({fields.length})
          </h2>
          
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-inbox text-4xl mb-4"></i>
              <p>No fields configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => renderFieldEditor(field, index))}
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
            <li>• <strong>No database changes</strong>: All modifications are configuration-only</li>
            <li>• <strong>Save</strong>: Persist your configuration changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
