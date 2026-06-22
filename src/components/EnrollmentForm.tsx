import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, CheckCircle, Upload, Calendar, Clock, Users, Award, Rocket, TrendingUp, Trophy, Briefcase, FileText, Gift, Bot } from 'lucide-react';

// Zod schema for form validation
const enrollmentSchema = z.object({
  // Personal Details
  fullName: z.string().min(2, 'Full name is required'),
  fathersName: z.string().min(2, 'Father\'s name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  
  // Academic Details
  collegeName: z.string().min(2, 'College name is required'),
  department: z.string().min(2, 'Department is required'),
  semester: z.string().min(1, 'Semester is required'),
  
  // Address Details
  address: z.string().min(10, 'Complete address is required'),
  post: z.string().min(2, 'Post is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
  
  // Payment
  paymentScreenshot: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB'),
  utr: z.string().min(1, 'UTR/Transaction ID is required'),
  
  // Declaration
  declaration: z.boolean().refine((val) => val === true, { message: 'You must accept the declaration' }),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

const EnrollmentForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      declaration: false,
    },
  });

  // Auto-fill city, state based on PIN code (mock data)
  const handlePinCodeChange = (value: string) => {
    if (value.length === 6) {
      // Mock PIN code to location mapping
      const pinCodeData: Record<string, { city: string; state: string }> = {
        '560001': { city: 'Bangalore', state: 'Karnataka' },
        '560002': { city: 'Bangalore', state: 'Karnataka' },
        '560003': { city: 'Bangalore', state: 'Karnataka' },
        '110001': { city: 'New Delhi', state: 'Delhi' },
        '110002': { city: 'New Delhi', state: 'Delhi' },
        '400001': { city: 'Mumbai', state: 'Maharashtra' },
        '400002': { city: 'Mumbai', state: 'Maharashtra' },
        '600001': { city: 'Chennai', state: 'Tamil Nadu' },
        '600002': { city: 'Chennai', state: 'Tamil Nadu' },
        '700001': { city: 'Kolkata', state: 'West Bengal' },
        '700002': { city: 'Kolkata', state: 'West Bengal' },
        '500001': { city: 'Hyderabad', state: 'Telangana' },
        '500002': { city: 'Hyderabad', state: 'Telangana' },
        '380001': { city: 'Ahmedabad', state: 'Gujarat' },
        '380002': { city: 'Ahmedabad', state: 'Gujarat' },
        '302001': { city: 'Jaipur', state: 'Rajasthan' },
        '302002': { city: 'Jaipur', state: 'Rajasthan' },
      };

      const location = pinCodeData[value];
      if (location) {
        setValue('city', location.city);
        setValue('state', location.state);
      }
    }
  };

  // Auto-fill city, state, pin code based on post (mock data)
  const handlePostChange = (value: string) => {
    if (value.length >= 3) {
      // Mock post to location mapping
      const postData: Record<string, { city: string; state: string; pinCode: string }> = {
        'basavanagudi': { city: 'Bangalore', state: 'Karnataka', pinCode: '560004' },
        'indiranagar': { city: 'Bangalore', state: 'Karnataka', pinCode: '560038' },
        'koramangala': { city: 'Bangalore', state: 'Karnataka', pinCode: '560034' },
        'connaught place': { city: 'New Delhi', state: 'Delhi', pinCode: '110001' },
        'karol bagh': { city: 'New Delhi', state: 'Delhi', pinCode: '110005' },
        'andheri': { city: 'Mumbai', state: 'Maharashtra', pinCode: '400058' },
        'bandra': { city: 'Mumbai', state: 'Maharashtra', pinCode: '400050' },
        't nagar': { city: 'Chennai', state: 'Tamil Nadu', pinCode: '600017' },
        'anna nagar': { city: 'Chennai', state: 'Tamil Nadu', pinCode: '600040' },
        'park street': { city: 'Kolkata', state: 'West Bengal', pinCode: '700016' },
        'salt lake': { city: 'Kolkata', state: 'West Bengal', pinCode: '700091' },
        'banjara hills': { city: 'Hyderabad', state: 'Telangana', pinCode: '500034' },
        'madhapur': { city: 'Hyderabad', state: 'Telangana', pinCode: '500081' },
        'navrangpura': { city: 'Ahmedabad', state: 'Gujarat', pinCode: '380009' },
        'bopal': { city: 'Ahmedabad', state: 'Gujarat', pinCode: '380058' },
        'c scheme': { city: 'Jaipur', state: 'Rajasthan', pinCode: '302001' },
        'vaishali nagar': { city: 'Jaipur', state: 'Rajasthan', pinCode: '302021' },
      };

      const lowerValue = value.toLowerCase();
      for (const [key, location] of Object.entries(postData)) {
        if (key.includes(lowerValue) || lowerValue.includes(key)) {
          setValue('city', location.city);
          setValue('state', location.state);
          setValue('pinCode', location.pinCode);
          break;
        }
      }
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('paymentScreenshot', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      console.log('Submitting form data:', data);

      // Convert file to base64 for sending
      const paymentScreenshotBase64 = data.paymentScreenshot instanceof File
        ? await fileToBase64(data.paymentScreenshot)
        : '';

      // Prepare data for Google Sheets
      const formData = {
        timestamp: new Date().toISOString(),
        fullName: data.fullName,
        fathersName: data.fathersName,
        email: data.email,
        mobile: data.mobile,
        dateOfBirth: data.dateOfBirth,
        collegeName: data.collegeName,
        department: data.department,
        semester: data.semester,
        address: data.address,
        post: data.post,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        utr: data.utr,
        paymentScreenshot: paymentScreenshotBase64,
      };

      console.log('Sending to Google Sheets:', formData);

      // Use API route to avoid CORS issues on Vercel
      const API_URL = '/api/submit-form';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response received:', response);
      alert('Your google form is submitted successfully! pllease wait for 24 hours for getting reply on your mail please be active on mail to get more information');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-primary">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ✅ Registration Submitted Successfully
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you for enrolling in the AI Tools & Project Development Internship Program.
              </p>
              <p className="text-gray-600 text-sm">
                Our team will verify your payment and application details. You will receive further communication via email or mobile number shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Single Card with All Content */}
        <div className="bg-white rounded-lg shadow-md border-t-4 border-primary">
          <div className="p-6 md:p-8">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  AI Tools & Project Development Internship Program 2026
                </h1>
                <p className="text-lg md:text-xl font-semibold text-gray-700">
                  (New Batch Starting from 2 July)
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to the 1-Month AI Tools & Project Development Internship Program 2026.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              This internship is designed for students who want to learn how to use modern AI tools to increase productivity, automate tasks, and build real-world projects. Participants will gain hands-on experience with AI-powered platforms, prompt engineering, content creation, website development, and project building.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              By the end of the internship, students will understand how AI can simplify daily work, improve learning, and help create professional projects for academic and career growth.
            </p>

            {/* Benefits Section */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { icon: CheckCircle, text: 'Learn Popular AI Tools' },
                { icon: CheckCircle, text: 'Build Real-World AI Projects' },
                { icon: CheckCircle, text: 'Improve Productivity & Automation Skills' },
                { icon: CheckCircle, text: 'Hands-on Practical Learning' },
                { icon: FileText, text: 'Internship Certificate (Soft Copy)' },
                { icon: Award, text: 'Internship Certificate (Hard Copy)' },
                { icon: Gift, text: 'Reward Kit Delivered to Your Address' },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <benefit.icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Internship Details */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Internship Details</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-gray-700"><strong>Duration:</strong> 1 Month</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-gray-700"><strong>Enrollment Fee:</strong> ₹999</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <span className="text-gray-700"><strong>Last Date for Registration:</strong> 24 June 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700"><strong>Limited Seats Available.</strong> Registration will be confirmed only after successful payment verification.</span>
              </div>
            </div>

            {/* Student Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Details */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Personal Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fathersName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter father's name"
                  />
                  {errors.fathersName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fathersName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('mobile')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {errors.mobile && (
                    <p className="text-red-600 text-sm mt-1">{errors.mobile.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>

              {/* Academic Details */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Academic Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('collegeName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter your college name"
                  />
                  {errors.collegeName && (
                    <p className="text-red-600 text-sm mt-1">{errors.collegeName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department / Branch <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('department')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter your department/branch"
                  />
                  {errors.department && (
                    <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register('semester')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                  {errors.semester && (
                    <p className="text-red-600 text-sm mt-1">{errors.semester.message}</p>
                  )}
                </div>
              </div>

              {/* Address Details */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                Address Details (For Reward Kit Delivery)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complete Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('post', {
                      onChange: (e) => handlePostChange(e.target.value)
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter post name"
                  />
                  {errors.post && (
                    <p className="text-red-600 text-sm mt-1">{errors.post.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('state')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('pinCode', {
                        onChange: (e) => handlePinCodeChange(e.target.value)
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="6-digit PIN"
                    />
                    {errors.pinCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.pinCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Payment Section</h2>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Enrollment Fee</h3>
                <p className="text-2xl font-bold text-primary mb-4">Amount Payable: ₹999</p>
                
                <div className="bg-white rounded-lg p-4 mb-4 flex justify-center">
                  <div className="text-center">
                    <img src="/phonepay.jpeg" alt="PhonePe QR Code" className="w-48 h-48 mx-auto rounded" />
                    <p className="text-sm text-gray-500 mt-2">Scan to Pay via PhonePe</p>
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <span>💳</span>
                    <span>Pay Now</span>
                  </button>

                  {showPaymentOptions && (
                    <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                      <a
                        href="phonepe://pay?pa=8650115781@axl&pn=Tridio&am=999&cu=INR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                      >
                        <span>📱</span>
                        <span>PhonePe</span>
                      </a>
                      <a
                        href="tez://upi/pay?pa=8650115781@axl&pn=Tridio&am=999&cu=INR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                      >
                        <span>💳</span>
                        <span>Google Pay</span>
                      </a>
                      <a
                        href="paytm://upi/pay?pa=8650115781@axl&pn=Tridio&am=999&cu=INR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                      >
                        <span>💰</span>
                        <span>Paytm</span>
                      </a>
                      <a
                        href="upi://pay?pa=8650115781@axl&pn=Tridio&am=999&cu=INR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                      >
                        <span>🔗</span>
                        <span>Any UPI App</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-gray-700">
                  <p><strong>Payment Instructions:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Scan the QR Code</li>
                    <li>Pay ₹999</li>
                    <li>Upload Payment Screenshot</li>
                    <li>Enter UTR/Transaction ID</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Payment Screenshot <span className="text-red-600">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentChange}
                      className="hidden"
                      id="payment-upload"
                    />
                    <label htmlFor="payment-upload" className="cursor-pointer">
                      {paymentPreview ? (
                        <img src={paymentPreview} alt="Payment Preview" className="max-h-48 mx-auto rounded" />
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload payment screenshot</p>
                          <p className="text-sm text-gray-500 mt-1">Max 5 MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.paymentScreenshot && (
                    <p className="text-red-600 text-sm mt-1">{errors.paymentScreenshot.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UTR / Transaction ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('utr')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Enter UTR or Transaction ID"
                  />
                  {errors.utr && (
                    <p className="text-red-600 text-sm mt-1">{errors.utr.message}</p>
                  )}
                </div>
              </div>

              {/* Internship Benefits Cards */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Internship Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: FileText, title: 'Internship Certificate (Soft Copy)', color: 'text-blue-600' },
                  { icon: Award, title: 'Internship Certificate (Hard Copy)', color: 'text-purple-600' },
                  { icon: Gift, title: 'Reward Kit', color: 'text-pink-600' },
                  { icon: Bot, title: 'AI Tools Training', color: 'text-green-600' },
                  { icon: Briefcase, title: 'Real-World Project Building', color: 'text-orange-600' },
                  { icon: Rocket, title: 'Productivity & Automation Skills', color: 'text-red-600' },
                  { icon: TrendingUp, title: 'Career Development', color: 'text-indigo-600' },
                  { icon: Trophy, title: 'Completion Recognition', color: 'text-yellow-600' },
                ].map((benefit, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100 hover:shadow-md transition">
                    <benefit.icon className={`w-8 h-8 ${benefit.color} mb-2`} />
                    <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                  </div>
                ))}
              </div>

              {/* Declaration */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('declaration')}
                  className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label className="text-sm text-gray-700">
                  I hereby declare that all information provided by me is correct. I understand that my enrollment will be confirmed only after payment verification. <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.declaration && (
                <p className="text-red-600 text-sm mt-2">{errors.declaration.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Enroll for Internship Now'}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-8 text-gray-500 text-sm border-t pt-4">
              <p>© 2026 Tridiotech. All rights reserved.</p>
              <p className="mt-1">Last Date for Registration: 24/06/2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;
