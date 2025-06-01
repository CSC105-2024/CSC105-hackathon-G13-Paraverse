import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import Navbar from '../components/UI/Navbar';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ 
    username: '', 
    email: '', 
    joinDate: '',
    profilePicture: null 
  });
  const [editUsername, setEditUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  /** Fetch profile on mount */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found in localStorage');
          navigate('/login');
          return;
        }

        console.log('Fetching profile data...');
        const res = await axios.get('http://localhost:3306/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status && res.data.user) {
          const user = res.data.user;
          const joined = new Date(user.createdAt || Date.now()).toLocaleDateString();
          
          setUserData({ 
            username: user.username, 
            email: user.email, 
            joinDate: joined,
            profilePicture: user.profilePicture || null
          });
          setEditUsername(user.username);
          
          if (user.profilePicture) {
            setPreviewImage(user.profilePicture);
          }
          
          console.log('Profile data loaded successfully');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile information');
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  /** Handle image selection */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Image selected:', file.name, file.size, file.type);

    // Reset previous errors
    setError('');

    // Validate file size (2MB limit)
    if (file.size > 2000000) {
      setError('Image too large. Please select an image smaller than 2MB.');
      e.target.value = null;
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF, WebP).');
      e.target.value = null;
      return;
    }

    setProfileImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      console.log('Image preview created');
    };
    reader.onerror = () => {
      setError('Error reading image file');
      console.error('FileReader error');
    };
    reader.readAsDataURL(file);
  };

  /** Submit profile changes */
  const saveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/login');
        return;
      }

      // Validate username
      if (!editUsername || editUsername.trim().length < 1) {
        setError('Username is required');
        return;
      }

      console.log('Submitting profile update...');
      console.log('Data:', { 
        username: editUsername.trim(), 
        hasImage: !!profileImage,
        imageSize: profileImage?.size,
        imageType: profileImage?.type 
      });

      const formData = new FormData();
      formData.append('username', editUsername.trim());
      
      if (profileImage) {
        formData.append('profilePicture', profileImage);
        console.log('Image attached to form data');
      }

      const res = await axios.put(
        'http://localhost:3306/auth/update-profile',
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type - let browser handle it for FormData
          },
          timeout: 30000 // 30 second timeout for large images
        }
      );

      console.log('Server response:', res.data);

      if (res.data.status) {
        // Update local state with new data
        setUserData((prev) => ({ 
          ...prev, 
          username: editUsername.trim(),
          profilePicture: res.data.user.profilePicture || prev.profilePicture 
        }));
        
        // Update preview image if new profile picture was set
        if (res.data.user.profilePicture) {
          setPreviewImage(res.data.user.profilePicture);
        }
        
        setSuccess('Profile updated successfully! ');
        setEditMode(false);
        setProfileImage(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        console.log('Profile update completed successfully');
      } else {
        throw new Error(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      
      let errorMessage = 'Failed to update profile';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        localStorage.removeItem('token');
        navigate('/login');
        return;
      } else if (err.response?.status === 413) {
        errorMessage = 'Image too large. Please choose a smaller image.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try with a smaller image.';
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /** Cancel edit mode */
  const cancelEdit = () => {
    setEditMode(false);
    setEditUsername(userData.username);
    setPreviewImage(userData.profilePicture);
    setProfileImage(null);
    setError('');
    setSuccess('');
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  /** Get avatar display */
  const getAvatarDisplay = () => {
    if (previewImage) {
      return (
        <div className="relative">
          <img 
            src={previewImage} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
            onError={(e) => {
              console.error('Image load error');
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
        </div>
      );
    }

    const initials = userData.username ? userData.username[0].toUpperCase() : '?';
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center shadow-md">
          <span className="text-2xl font-bold text-amber-800">{initials}</span>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-amber-400"></div>
      </div>
    );
  };

  if (loading) return (
    <>
      {/* <Navbar /> */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-center">
              {success}
            </div>
          )}

          {!editMode ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                  {getAvatarDisplay()}
                </div>
                <div className="space-y-4 w-full">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Username</h3>
                    <p className="text-lg font-medium">{userData.username}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</h3>
                    <p className="text-lg font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Member Since</h3>
                    <p className="text-lg font-medium">{userData.joinDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-[#5885AF] text-white py-3 px-4 rounded-lg hover:bg-[#46698a] transition-colors mt-8 font-medium"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                  {getAvatarDisplay()}
                </div>
              </div>
              
              <form onSubmit={saveChanges} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5885AF] focus:ring-1 focus:ring-[#5885AF]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Select a new image to change your profile picture (max 2MB). Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5885AF] focus:ring-1 focus:ring-[#5885AF]"
                    required
                    minLength={1}
                    maxLength={50}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#5885AF] text-white py-3 px-4 rounded-lg hover:bg-[#46698a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;