import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface SelectedFile {
  file: File;
  preview: string;
  id: string;
}

export default function ImageUploadForm() {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles(prev => [
            ...prev,
            {
              file,
              preview: reader.result as string,
              id: Math.random().toString(36).substr(2, 9)
            }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setStatus('uploading');
    
    // Logic: In a real app, we would process the files here.
    // For now, we simulate success.
    console.log(`Uploading ${selectedFiles.length} files to teacher profile`);
    
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setStatus('idle');
  };

  return (
    <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden w-full">
      <div className="bg-[#002B49] text-white px-4 py-2 font-semibold text-[14px] flex justify-between items-center">
        <span>Multiple Image Upload & Profile Assignment</span>
        <span className="text-[11px] font-normal opacity-80 uppercase tracking-wider">Teacher Wise</span>
      </div>
      
      <div className="p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {status !== 'success' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedFiles.length > 0 ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('input')) return;
                  fileInputRef.current?.click();
                }}
              >
                <Upload size={40} className={`${selectedFiles.length > 0 ? 'text-blue-400' : 'text-gray-400'} mb-3`} />
                <p className="text-[14px] text-gray-700 font-bold">
                  {selectedFiles.length > 0 ? 'Add More Images' : 'Click or Drag & Drop Images'}
                </p>
                <p className="text-[11px] text-gray-400 mt-2">Professional profile image upload area</p>

                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={status === 'uploading'}
                />
              </div>

              {/* Preview Grid */}
              {selectedFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                      <ImageIcon size={16} />
                      Images Previews ({selectedFiles.length})
                    </h3>
                    <button 
                      onClick={() => setSelectedFiles([])}
                      className="text-[11px] text-red-600 hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={file.id} className="relative aspect-square bg-[#f5f5f5] rounded-sm border border-[#ddd] overflow-hidden group">
                        <img 
                          src={file.preview} 
                          alt="preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                          <p className="text-[10px] font-bold truncate w-full px-1">{file.file.name}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                            className="mt-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleUpload}
                disabled={status === 'uploading' || selectedFiles.length === 0}
                className="w-full bg-[#4a89c5] text-white py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-sm flex justify-center items-center gap-2"
              >
                {status === 'uploading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing & Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit {selectedFiles.length} Images to Teacher Profile
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 p-8 rounded-sm text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-green-800">Upload Successful!</h2>
                <p className="text-[13px] text-green-600/80">
                  {selectedFiles.length} images have been uploaded and assigned to the profile.
                </p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleReset}
                  className="bg-green-600 text-white px-8 py-2 rounded-sm font-bold text-[13px] hover:bg-green-700 transition-colors shadow-sm"
                >
                  Upload More for Another Teacher
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
