import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionAPI } from '@/lib/api';
import { 
  FileText, 
  BookOpen, 
  Hash, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  PlusCircle,
  Trash2,
  Save,
  X
} from 'lucide-react';

const QuestionForm = ({ question = null, onSubmit, onCancel, isEditing = false, selectedClass = null }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'mcq',
    subject: '',
    class: selectedClass || '',
    chapterNumber: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });
  
  // Predefined subjects for classes 2-8
  const getSubjectOptions = (classNumber) => {
    if (classNumber >= 2 && classNumber <= 8) {
      return ['English', 'Urdu', 'Math', 'Science'];
    }
    // For classes 9-10, we'll handle this later
    return ['English', 'Urdu', 'Math', 'Science']; // Default for now
  };
  
  const [loading, setLoading] = useState(false);
  // Populate form when editing
  useEffect(() => {
    if (question && isEditing) {
      setFormData({
        questionText: question.questionText || '',
        questionType: question.questionType || 'mcq',
        subject: question.subject || '',
        class: question.class || selectedClass || '',
        chapterNumber: question.chapterNumber || '',
        options: question.options?.length > 0 ? question.options : [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      });
    }
  }, [question, isEditing, selectedClass]);  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Reset subject when class changes
    if (name === 'class') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subject: '' // Reset subject when class changes
      }));
    } else if (name === 'questionType') {
      // When question type changes, adjust options accordingly
      let newOptions = [...formData.options];
      
      if (value === 'mcq') {
        // MCQ must have exactly 4 options
        newOptions = [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ];
      } else if (value === 'true_false') {
        // True/False must have exactly 2 options
        newOptions = [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: false }
        ];
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        options: newOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleFileChange = (e) => {
    // File uploads removed - no longer needed
  };
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    
    if (field === 'isCorrect') {
      // For MCQ and True/False, only one option can be correct
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index ? value : false;
      });
    } else if (field === 'text') {
      // Don't allow editing text for True/False questions
      if (formData.questionType === 'true_false') {
        return; // Prevent editing True/False option text
      }
      newOptions[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };
  const addOption = () => {
    // For MCQ, always maintain exactly 4 options
    if (formData.questionType === 'mcq') {
      return; // Don't allow adding more than 4 options for MCQ
    }
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }]
    }));
  };

  const removeOption = (index) => {
    // For MCQ, don't allow removing options (must have exactly 4)
    if (formData.questionType === 'mcq') {
      return;
    }
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };
  const handleTagsChange = (e) => {
    // Tags removed - no longer needed
  };
  const handleKeywordsChange = (e) => {
    // Keywords removed - no longer needed
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate MCQ questions have exactly 4 options, all filled
      if (formData.questionType === 'mcq') {
        if (formData.options.length !== 4) {
          alert('MCQ questions must have exactly 4 options.');
          setLoading(false);
          return;
        }
        
        const emptyOptions = formData.options.filter(option => !option.text.trim());
        if (emptyOptions.length > 0) {
          alert('All 4 options must be filled for MCQ questions.');
          setLoading(false);
          return;
        }
        
        const correctOptions = formData.options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
          alert('MCQ questions must have exactly one correct option selected.');
          setLoading(false);
          return;
        }
      }

      // Validate True/False questions
      if (formData.questionType === 'true_false') {
        if (formData.options.length !== 2) {
          alert('True/False questions must have exactly 2 options.');
          setLoading(false);
          return;
        }
        
        const optionTexts = formData.options.map(option => option.text.trim().toLowerCase());
        if (!optionTexts.includes('true') || !optionTexts.includes('false')) {
          alert('True/False questions must have "True" and "False" options only.');
          setLoading(false);
          return;
        }
        
        const correctOptions = formData.options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
          alert('True/False questions must have exactly one correct option selected.');
          setLoading(false);
          return;
        }
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };
  const classOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const questionTypeOptions = [
    { value: 'mcq', label: 'Multiple Choice', icon: Target, color: 'text-blue-500' },
    { value: 'true_false', label: 'True/False', icon: CheckCircle2, color: 'text-green-500' },
    { value: 'short', label: 'Short Answer', icon: FileText, color: 'text-purple-500' },
    { value: 'long', label: 'Long Answer', icon: BookOpen, color: 'text-orange-500' }
  ];

  const getQuestionTypeIcon = (type) => {
    const option = questionTypeOptions.find(opt => opt.value === type);
    return option ? option.icon : FileText;
  };

  const getQuestionTypeColor = (type) => {
    const option = questionTypeOptions.find(opt => opt.value === type);
    return option ? option.color : 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {isEditing ? 'Edit Question' : 'Create New Question'}
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            {isEditing ? 'Update your question details and options' : 'Design engaging questions for your students'}
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-scaleIn overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-sm text-gray-600">Set up the question fundamentals</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject Selection */}
                  <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Subject *
                    </Label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-blue-300"
                      >
                        <option value="">Select Subject</option>
                        {getSubjectOptions(parseInt(formData.class)).map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="w-5 h-5 text-gray-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Class Selection */}
                  <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <Label htmlFor="class" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-green-500" />
                      Class *
                    </Label>
                    <div className="relative">
                      <select
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        required
                        disabled={selectedClass !== null}
                        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-blue-300 ${
                          selectedClass !== null ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="">Select Class</option>
                        {classOptions.map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="w-5 h-5 text-gray-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Number */}
                  <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <Label htmlFor="chapterNumber" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-500" />
                      Chapter Number *
                    </Label>
                    <Input
                      id="chapterNumber"
                      name="chapterNumber"
                      type="number"
                      min="1"
                      value={formData.chapterNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 1, 2, 3"
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Question Type */}
                  <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                    <Label htmlFor="questionType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      Question Type *
                    </Label>
                    <div className="relative">
                      <select
                        id="questionType"
                        name="questionType"
                        value={formData.questionType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-blue-300"
                      >
                        {questionTypeOptions.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="w-5 h-5 text-gray-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Text Section */}
              <div className="space-y-4 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Question Content</h3>
                    <p className="text-sm text-gray-600">Write your question clearly and concisely</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionText" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Question Text *
                  </Label>
                  <textarea
                    id="questionText"
                    name="questionText"
                    value={formData.questionText}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter the question text here..."
                  />
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Make sure your question is clear and easy to understand
                  </div>
                </div>
              </div>              {/* Options Section for MCQ and True/False */}
              {(formData.questionType === 'mcq' || formData.questionType === 'true_false') && (
                <div className="space-y-4 animate-slideUp" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${
                      formData.questionType === 'mcq' 
                        ? 'from-blue-100 to-cyan-100' 
                        : 'from-green-100 to-emerald-100'
                    } rounded-xl flex items-center justify-center`}>
                      {React.createElement(getQuestionTypeIcon(formData.questionType), {
                        className: `w-5 h-5 ${getQuestionTypeColor(formData.questionType)}`
                      })}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Answer Options</h3>
                      <p className="text-sm text-gray-600">
                        {formData.questionType === 'mcq' 
                          ? 'Create 4 options and mark the correct one'
                          : 'Select the correct answer between True and False'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Helper Text */}
                  <div className={`p-4 rounded-xl border-l-4 ${
                    formData.questionType === 'mcq' 
                      ? 'bg-blue-50 border-blue-400' 
                      : 'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`w-4 h-4 mt-0.5 ${
                        formData.questionType === 'mcq' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                      <div className="text-sm">
                        {formData.questionType === 'mcq' ? (
                          <p className="text-blue-800">
                            <strong>MCQ Guidelines:</strong> Fill all 4 options and select exactly one correct answer.
                          </p>
                        ) : (
                          <p className="text-green-800">
                            <strong>True/False:</strong> Options are fixed. Just select the correct answer.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`group p-4 border-2 rounded-xl transition-all duration-200 ${
                          option.isCorrect 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Radio Button */}
                          <div className="relative">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={option.isCorrect}
                              onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => handleOptionChange(index, 'isCorrect', !option.isCorrect)}
                              className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                option.isCorrect
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {option.isCorrect && (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>

                          {/* Option Content */}
                          <div className="flex-1">
                            {formData.questionType === 'true_false' ? (
                              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                option.text === 'True' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {option.text}
                              </div>
                            ) : (
                              <div className="relative">
                                <Input
                                  value={option.text}
                                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                  required
                                  className="pl-4 pr-12 py-2 border-0 bg-transparent focus:ring-0 focus:border-transparent text-sm"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Correct Indicator */}
                          {option.isCorrect && (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-medium animate-fadeIn">
                              <CheckCircle2 className="w-4 h-4" />
                              Correct
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Non-MCQ Answer Note */}
              {formData.questionType !== 'mcq' && formData.questionType !== 'true_false' && (
                <div className="space-y-4 animate-slideUp" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Answer Information</h3>
                      <p className="text-sm text-gray-600">Important note about answer handling</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900 mb-2">Answer Handling</h4>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          For {formData.questionType === 'short' ? 'short answer' : 'long answer'} questions, 
                          answers will be handled via PDF generation for printing. No need to enter the correct 
                          answer here as students will write their responses on paper.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 animate-slideUp" style={{ animationDelay: '0.7s' }}>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isEditing ? 'Update Question' : 'Create Question'}
                      </>
                    )}
                  </div>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionForm;
