import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Image, User, MapPin, AlignLeft, Upload, Camera, CheckCircle2 } from 'lucide-react';

const compressProfileImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.88) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

const EditProfileModal = () => {
  const { currentUser, updateProfile, setIsEditProfileOpen, toggleVerificationStatus } = useApp();

  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [profilePicture, setProfilePicture] = useState(currentUser.profile_picture || '');
  const [coverPhoto, setCoverPhoto] = useState(currentUser.cover_photo || '');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressProfileImage(file, 400, 400, 0.88);
      if (compressed) {
        setProfilePicture(compressed);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicture(reader.result);
        };
        reader.readAsDataURL(file);
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5000/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setProfilePicture(data.url);
      }
    } catch (err) {
      console.log('Avatar processed locally:', err);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressProfileImage(file, 1200, 480, 0.85);
      if (compressed) {
        setCoverPhoto(compressed);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPhoto(reader.result);
        };
        reader.readAsDataURL(file);
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5000/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setCoverPhoto(data.url);
      }
    } catch (err) {
      console.log('Cover photo processed locally:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      username,
      bio,
      location,
      profile_picture: profilePicture,
      cover_photo: coverPhoto,
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Edit Profile</h3>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Profile Picture Upload Section */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative size-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
              <img
                src={profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
                alt="Avatar preview"
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="size-3.5 text-indigo-600" />
                Profile Avatar Photo
              </span>
              <p className="text-[11px] text-slate-400">Recommended 1:1 ratio square photo</p>
              <label className="mt-2 inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all">
                <Upload className="size-3.5" />
                <span>Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cover Photo Upload Section */}
          <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Image className="size-3.5 text-indigo-600" />
              Profile Cover Header Photo
            </span>

            {coverPhoto ? (
              <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200">
                <img src={coverPhoto} alt="Cover preview" className="size-full object-cover" />
                <label className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[11px] font-semibold cursor-pointer hover:bg-slate-900">
                  Change Cover
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-white text-xs font-semibold text-slate-700 cursor-pointer transition-all">
                <Upload className="size-4 text-indigo-600" />
                <span>Upload Cover Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <User className="size-3.5 text-indigo-600" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <AlignLeft className="size-3.5 text-indigo-600" />
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <MapPin className="size-3.5 text-indigo-600" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Creator Verification Blue Badge */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 mt-1">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-indigo-400 fill-white shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Verified Creator Badge</span>
                <span className="text-[10px] text-slate-400">
                  {currentUser.is_verified ? 'Verified creator on Ryzo' : 'Get a blue checkmark badge on your profile'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleVerificationStatus}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentUser.is_verified
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'
              }`}
            >
              {currentUser.is_verified ? 'Remove Badge' : 'Request Badge'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
