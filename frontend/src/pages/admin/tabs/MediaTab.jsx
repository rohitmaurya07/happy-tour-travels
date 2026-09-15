import React, { useState } from 'react';
import { Video, Upload, Image, Save, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { updateMediaSettings, uploadMediaFile } from '../../../services/api';

export default function MediaTab() {
  const { mediaSettings, refreshSiteData } = useSiteData();
  const [formData, setFormData] = useState({ ...mediaSettings });
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, heroVideoUrl: url }));
      setStatusMsg({ type: 'success', text: 'Hero background video uploaded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Video upload failed' });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, logoUrl: url }));
      setStatusMsg({ type: 'success', text: 'Brand logo uploaded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Logo upload failed' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      await updateMediaSettings(formData);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Media and Hero video settings updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update media settings' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Video className="w-3.5 h-3.5 text-yellow-600" />
            <span>Media & Hero Video</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Website Videos & Visual Assets</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Update homepage background video, headlines, trust badges, and brand images.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Media Settings'}</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fadeIn ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Media Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column 1: Hero Background Video */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Video className="w-5 h-5 text-brand-yellow" />
            <h2 className="text-base font-bold font-heading text-slate-900">Homepage Background Video</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hero Video File or URL
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={formData.heroVideoUrl}
                onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                placeholder="/assets/herovideo.mp4 or https://..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
              />
              <label className="w-full sm:w-auto yellow-gradient-btn px-4 py-3.5 rounded-xl text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-sm">
                <Upload className="w-4 h-4" />
                <span>{isUploadingVideo ? 'Uploading...' : 'Upload MP4'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={isUploadingVideo}
                />
              </label>
            </div>
          </div>

          {/* Video Live Preview */}
          {formData.heroVideoUrl && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 bg-slate-950 relative h-56 flex items-center justify-center">
              <video
                key={formData.heroVideoUrl}
                src={formData.heroVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-950/80 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center space-x-1">
                <Play className="w-3 h-3 fill-yellow-400" />
                <span>Live Video Preview</span>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Hero Headlines & Banners */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-bold font-heading text-slate-900">Hero Headlines & Trust Badges</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hero Main Headline
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Highlighted Yellow Word(s) in Headline
            </label>
            <input
              type="text"
              value={formData.heroHighlightedWord}
              onChange={(e) => setFormData({ ...formData, heroHighlightedWord: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-yellow-600 text-sm focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hero Subtitle
            </label>
            <textarea
              rows="2"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Trust Badge Text
            </label>
            <input
              type="text"
              value={formData.trustBadgeText}
              onChange={(e) => setFormData({ ...formData, trustBadgeText: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
            />
          </div>

          {/* Site Logo */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brand Logo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900"
              />
              <label className="yellow-gradient-btn px-4 py-3 rounded-xl text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-sm">
                <Upload className="w-4 h-4" />
                <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isUploadingLogo}
                />
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
