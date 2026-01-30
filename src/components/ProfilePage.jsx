import { useState, useEffect } from 'react'
import { FiArrowLeft, FiEdit, FiSave, FiUser, FiBriefcase, FiMapPin, FiMail, FiPhone, FiHash, FiCalendar, FiMessageCircle, FiExternalLink } from 'react-icons/fi'

const ProfilePage = ({ userProfile, onSave, onBack }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userProfile || {})

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile)
    }
  }, [userProfile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    onSave(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(userProfile || {})
    setIsEditing(false)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your MSME business details</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg border border-blue-300/60 bg-blue-500/10 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-900/50 flex items-center gap-2 text-sm font-medium"
              >
                <FiEdit size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300/70 bg-gray-100/60 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg border border-green-300/70 bg-green-500/10 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-500/20 dark:hover:bg-green-900/60 flex items-center gap-2 text-sm font-medium"
                >
                  <FiSave size={18} />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-8">
          {/* Top section with avatar */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
            {/* UPDATED: Profile Picture Rendering */}
            {formData.picture ? (
              <img 
                src={formData.picture} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-2 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <FiUser className="text-white" size={36} />
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="businessOwnerName"
                    value={formData?.businessOwnerName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  formData?.businessOwnerName || 'Business Owner'
                )}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditing ? (
                  <input
                    type="text"
                    name="businessName"
                    value={formData?.businessName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  formData?.businessName || 'Business Name'
                )}
              </p>
            </div>
          </div>

          {/* Grid details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiBriefcase size={16} />
                Business Type / Industry
              </label>
              {isEditing ? (
                <select
                  name="businessType"
                  value={formData?.businessType || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Business Type</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Textile">Textile</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Trading">Trading</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.businessType || 'Not specified'}
                </p>
              )}
            </div>

            {/* MSME Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiHash size={16} />
                MSME Category
              </label>
              {isEditing ? (
                <select
                  name="msmeCategory"
                  value={formData?.msmeCategory || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Micro">Micro</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                </select>
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.msmeCategory || 'Not specified'}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiMapPin size={16} />
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData?.city || ''}
                  onChange={handleInputChange}
                  placeholder="Your city"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.city || 'Not specified'}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiMapPin size={16} />
                State
              </label>
              {isEditing ? (
                <select
                  name="state"
                  value={formData?.state || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.state || 'Not specified'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiMail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.email || 'Not specified'}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiPhone size={16} />
                Mobile Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData?.mobileNumber || ''}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.mobileNumber || 'Not specified'}
                </p>
              )}
            </div>

            {/* 
              WhatsApp Number Field
              ----------------------
              FUTURE INTEGRATIONS (DO NOT IMPLEMENT NOW):
              - WhatsApp Business API chatbot for compliance reminders
              - Automated deadline notifications via WhatsApp
              - Google Calendar sync for compliance deadlines
              - Google Tasks integration for pending compliances
              
              This field stores the user's WhatsApp number separately from mobile
              to enable targeted WhatsApp-based compliance communication.
            */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiMessageCircle size={16} className="text-green-500" />
                WhatsApp Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData?.whatsappNumber || ''}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                      {formData?.whatsappNumber || 'Not added yet'}
                    </p>
                    {/* WhatsApp Deep Link - Only show if number exists */}
                    {formData?.whatsappNumber && (
                      <a
                        href={`https://wa.me/${formData.whatsappNumber.replace(/[\s\-\(\)]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-3 rounded-lg border border-green-300/60 bg-green-500/10 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-900/50 flex items-center gap-2 text-sm font-medium transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <FiExternalLink size={16} />
                        Chat
                      </a>
                    )}
                  </div>
                  {/* Helper text for MSME context */}
                  <p className="text-xs text-gray-500 dark:text-gray-500 pl-1">
                    This number will be used for MSME compliance reminders via WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* GST Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiHash size={16} />
                GST Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="gstNumber"
                  value={formData?.gstNumber || ''}
                  onChange={handleInputChange}
                  placeholder="15-digit GSTIN"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.gstNumber || 'Not registered'}
                </p>
              )}
            </div>

            {/* Registration Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiCalendar size={16} />
                Business Registration Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="registrationDate"
                  value={formData?.registrationDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                  {formData?.registrationDate || 'Not specified'}
                </p>
              )}
            </div>
          </div>

          {/* Simple compliance summary strip */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Active Compliances</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Upcoming Deadlines</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Forms Filed This Month</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage