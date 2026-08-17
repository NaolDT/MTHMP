import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../api/upload.api';

export default function ImageUpload({ label, category, value, onChange, aspectRatio = 'aspect-video' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsUploading(true);
    try {
      const result = await uploadImage(file, category);
      onChange(result.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}

      <div className={`relative ${aspectRatio} w-full rounded-xl border-2 border-dashed overflow-hidden ${
        value ? 'border-transparent' : 'border-slate-200 bg-slate-50'
      }`}>
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-brand hover:bg-slate-100 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span className="text-xs">Uploading…</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-xs">Click to upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}