"use client";

import React, { useState } from 'react';
import { PlaceDetails } from '../types';

interface OrderFormProps {
  selectedBusiness: PlaceDetails;
  serviceType: 'remove' | 'reset';
  servicePrice: number;
  estimatedTime: string;
  onBack: () => void;
  onSubmit: (formData: OrderFormData) => void;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments: string;
  attachmentUrl?: string;
  agreeToTerms: boolean;
  // Company information for invoice
  isCompany: boolean;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyZip: string;
  companyCountry: string;
  companyTaxId: string; // VAT number or tax ID
}

const OrderForm: React.FC<OrderFormProps> = ({
  selectedBusiness,
  serviceType,
  servicePrice,
  estimatedTime,
  onBack,
  onSubmit
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
    agreeToTerms: false,
    isCompany: true, // Always true for business-only service
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyZip: '',
    companyCountry: 'United States',
    companyTaxId: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isUploading, setIsUploading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof OrderFormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof OrderFormData];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error when user checks the box
    if (formErrors[name as keyof OrderFormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof OrderFormData];
        return newErrors;
      });
    }
  };
  
  const handleUpload = () => {
    // This would normally connect to a file upload service
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setFormData(prev => ({ 
        ...prev, 
        attachmentUrl: "https://storage.example.com/documents/sample-attachment.pdf" 
      }));
    }, 1500);
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof OrderFormData, string>> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }
    
    // Company validation - always required since it's business-only
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }
    if (!formData.companyAddress.trim()) {
      errors.companyAddress = "Company address is required";
    }
    if (!formData.companyCity.trim()) {
      errors.companyCity = "City is required";
    }
    if (!formData.companyZip.trim()) {
      errors.companyZip = "ZIP code is required";
    }
    if (!formData.companyCountry.trim()) {
      errors.companyCountry = "Country is required";
    }
    if (!formData.companyTaxId.trim()) {
      errors.companyTaxId = "Tax ID / VAT Number is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-[#0D2959] hover:underline"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Service Selection
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Order</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Business:</span> {selectedBusiness.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Service:</span> {serviceType === 'remove' ? 'Remove Google Business Profile' : 'Reset Google Business Profile'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Estimated completion:</span> {estimatedTime}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-gray-600 font-medium">Total Price:</p>
            <p className="text-2xl font-bold text-[#0D2959]">{servicePrice} PLN</p>
            <p className="text-sm text-gray-500">Payment required upfront</p>
          </div>
        </div>
      </div>

      {/* Business Only Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Business Service Only</h3>
            <p className="text-sm text-blue-700">
              This service is exclusively available for businesses and companies. Please provide your company information below to proceed with your order.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full p-2 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full p-2 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            )}
          </div>
        </div>
        
        {/* Company Information Section - Always shown since it's business-only */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
                />
                {formErrors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address*
                </label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.companyAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
                />
                {formErrors.companyAddress && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyAddress}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  name="companyCity"
                  value={formData.companyCity}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.companyCity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
                />
                {formErrors.companyCity && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyCity}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code*
                </label>
                <input
                  type="text"
                  name="companyZip"
                  value={formData.companyZip}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.companyZip ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
                />
                {formErrors.companyZip && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyZip}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <select
                  name="companyCountry"
                  value={formData.companyCountry}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.companyCountry ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
                >
                  <option value="United States">United States</option>
                  <option value="Germany">Germany</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.companyCountry && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyCountry}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID / VAT Number*
                </label>
                <input
                  type="text"
                  name="companyTaxId"
                  value={formData.companyTaxId}
                  onChange={handleInputChange}
                  placeholder="e.g., PL1234567890"
                  className={`w-full p-2 border ${formErrors.companyTaxId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]`}
                />
                {formErrors.companyTaxId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyTaxId}</p>
                )}
              </div>
            </div>
          </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments (Optional)
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]"
            placeholder="Any additional information we should know..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment (Optional)
          </label>
          <div className="mt-1 flex items-center">
            {formData.attachmentUrl ? (
              <div className="flex items-center bg-blue-50 p-2 rounded border border-blue-200">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Document uploaded</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attachmentUrl: undefined }))}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D2959] ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Upload Document
                  </>
                )}
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Attach any relevant documents (PDF, JPG, PNG). Max 5MB.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-[#0D2959]">Important Information</h3>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>• Payment is required upfront before service begins</li>
            <li>• We&apos;ll keep you updated on the progress of your request</li>
            <li>• You&apos;ll receive all information at the email address provided above</li>
          </ul>
          
          <div className={`flex items-start ${formErrors.agreeToTerms ? 'border-l-4 border-red-500 pl-2' : ''}`}>
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleCheckboxChange}
              className="mt-1 mr-2"
            />
            <label htmlFor="agreeToTerms" className="text-sm">
              I agree to the <a href="#" className="text-[#0D2959] hover:underline">Terms and Conditions</a> and <a href="#" className="text-[#0D2959] hover:underline">Privacy Policy</a>*
            </label>
          </div>
          {formErrors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-[#0D2959] hover:bg-opacity-90 text-white rounded-md shadow-sm"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
