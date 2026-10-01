import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';
import api from '../../services/api';

const DEFAULT_PRESETS = [
  { label: 'Exterior (Carmel View)', url: '/uploads/village_exterior.jpg' },
  { label: 'Interior Seating', url: '/uploads/village_seating.jpg' },
  { label: 'Bakery Counter', url: '/uploads/village_counter.jpg' },
  { label: 'Bakery Shelves', url: '/uploads/village_bakery_shelves.jpg' },
  { label: 'Pastry & Puffs Display', url: '/uploads/village_shake.jpg' },
];

export const ImageUploader = ({
  value,
  onChange,
  label = 'Image',
  helpText = 'Upload an image, pick from cafe library, or enter a direct image URL.',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [customUrl, setCustomUrl] = useState(value || '');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    setCustomUrl(value || '');
  }, [value]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = (file.type && file.type.startsWith('image/')) || /\.(jpe?g|png|webp|gif|svg|bmp|jfif|avif|heic|heif|ico|tiff?)$/i.test(file.name);
    if (!isImage) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/uploads/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data.data?.url || res.data.url;
      if (res.data.success && uploadedUrl) {
        onChange(uploadedUrl);
        setCustomUrl(uploadedUrl);
        setUploadError('');
      } else {
        setUploadError(res.data.message || 'Upload failed');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setUploadError('');
    }
  };

  const selectPreset = (presetUrl) => {
    onChange(presetUrl);
    setCustomUrl(presetUrl);
    setUploadError('');
    setShowPresets(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-charcoal-800">{label}</label>}

      {/* Current Preview */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-coffee-200 bg-cream-100 max-h-56 flex items-center justify-center">
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
            onError={(e) => {
              e.currentTarget.src = '/uploads/village_counter.jpg';
            }}
          />
          <div className="absolute inset-0 bg-charcoal-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-charcoal-900 rounded-lg text-xs font-semibold shadow hover:bg-cream-100 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setCustomUrl('');
                setUploadError('');
              }}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-red-700 flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <span className="absolute bottom-2 left-2 text-[11px] bg-charcoal-950/80 text-white px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[85%]">
            {value}
          </span>
        </div>
      ) : (
        <div className="border-2 border-dashed border-coffee-200 rounded-xl p-4 bg-cream-50/50 hover:bg-cream-50 text-center transition-colors">
          <ImageIcon className="w-8 h-8 text-coffee-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-charcoal-800">No image chosen</p>
          <p className="text-xs text-charcoal-500 mt-0.5">Upload a photo, pick from cafe library, or enter URL</p>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" /> Upload File
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-coffee-100 hover:bg-coffee-200 text-coffee-800 rounded-lg text-xs font-semibold transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Choose from Cafe Photos
        </button>
      </div>

      {/* Preset Library Tray */}
      {showPresets && (
        <div className="p-3 bg-white border border-coffee-200 rounded-xl shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-coffee-700">Authentic Cafe Photos</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-xs text-charcoal-400 hover:text-charcoal-700"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DEFAULT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectPreset(preset.url)}
                className={`group relative rounded-lg overflow-hidden border text-left p-1 transition-all ${
                  value === preset.url ? 'border-burgundy-600 ring-2 ring-burgundy-400/50' : 'border-coffee-100 hover:border-coffee-400'
                }`}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded" />
                <span className="block text-[10px] font-medium text-charcoal-800 mt-1 truncate">{preset.label}</span>
                {value === preset.url && (
                  <span className="absolute top-2 right-2 bg-burgundy-600 text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Direct URL Input */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={customUrl}
            onChange={(e) => {
              const val = e.target.value;
              setCustomUrl(val);
              onChange(val);
              setUploadError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onChange(customUrl.trim());
                setUploadError('');
              }
            }}
            onBlur={() => {
              if (customUrl) onChange(customUrl.trim());
            }}
            placeholder="Or enter direct image URL (e.g. /uploads/..., https://...)"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-coffee-200 rounded-lg text-charcoal-800 focus:outline-none focus:border-burgundy-500"
          />
        </div>
        {customUrl !== value && (
          <button
            type="button"
            onClick={() => {
              onChange(customUrl.trim());
              setUploadError('');
            }}
            className="px-3 py-1.5 bg-coffee-800 text-white rounded-lg text-xs font-semibold hover:bg-coffee-900 transition-colors"
          >
            Apply
          </button>
        )}
      </div>

      {uploadError && <p className="text-xs text-red-600 font-medium">{uploadError}</p>}
      {helpText && <p className="text-[11px] text-charcoal-500">{helpText}</p>}
    </div>
  );
};
