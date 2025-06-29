import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Eye, Trash2, Archive } from 'lucide-react';
import QuestionForm from '@/components/QuestionForm';
import { questionAPI } from '@/lib/api';

const ClassQuestionManager = ({ selectedClass, onBack, onStatsRefresh }) => {
  const [view, setView] = useState('menu'); // 'menu', 'create', 'view', 'edit', 'inactive'
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [inactiveQuestions, setInactiveQuestions] = useState([]);

  useEffect(() => {
    if (selectedClass) {
      loadClassQuestions();
      loadClassStats();
    }
  }, [selectedClass]);
  const loadClassQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionAPI.getQuestions({ 
        class: selectedClass,
        limit: 100, // Load more questions for class view
        isActive: true // Only load active (non-deleted) questions
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInactiveQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionAPI.getQuestions({ 
        class: selectedClass,
        limit: 100,
        isActive: false // Load inactive/deleted questions
      });
      setInactiveQuestions(response.data.questions);
    } catch (error) {
      console.error('Failed to load inactive questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClassStats = async () => {
    try {
      const response = await questionAPI.getQuestionStats();
      const classStats = response.data.classDistribution?.find(c => c.class === selectedClass);
      setStats(classStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCreateQuestion = async (formData) => {
    try {
      await questionAPI.createQuestion(formData);
      setView('menu');
      loadClassQuestions();
      loadClassStats();
      onStatsRefresh?.(); // Refresh parent stats
      alert('Question created successfully!');
    } catch (error) {
      alert('Failed to create question: ' + error.message);
    }
  };

  const handleEditQuestion = async (formData) => {
    try {
      await questionAPI.updateQuestion(editingQuestion._id, formData);
      setEditingQuestion(null);
      setView('menu');
      loadClassQuestions();
      loadClassStats();
      onStatsRefresh?.(); // Refresh parent stats
      alert('Question updated successfully!');
    } catch (error) {
      alert('Failed to update question: ' + error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionAPI.deleteQuestion(questionId);
        loadClassQuestions();
        loadClassStats();
        onStatsRefresh?.(); // Refresh parent stats
        alert('Question deleted successfully!');
      } catch (error) {
        alert('Failed to delete question: ' + error.message);
      }
    }
  };

  const startEditQuestion = (question) => {
    setEditingQuestion(question);
    setView('edit');
  };

  const handleRestoreQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to restore this question?')) {
      try {
        // Update question to make it active again
        await questionAPI.updateQuestion(questionId, { isActive: true });
        loadInactiveQuestions(); // Refresh inactive questions list
        loadClassQuestions(); // Refresh active questions list
        loadClassStats();
        onStatsRefresh?.(); // Refresh parent stats
        alert('Question restored successfully!');
      } catch (error) {
        alert('Failed to restore question: ' + error.message);
      }
    }
  };

  const handlePermanentDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to permanently delete this question? This action cannot be undone!')) {
      try {
        await questionAPI.permanentDeleteQuestion(questionId);
        loadInactiveQuestions(); // Refresh inactive questions list
        alert('Question permanently deleted!');
      } catch (error) {
        alert('Failed to permanently delete question: ' + error.message);
      }
    }
  };

  // Menu View
  if (view === 'menu') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Classes</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                    <span className="text-white font-bold text-xl">{selectedClass}</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold animate-fade-in">Class {selectedClass} Questions</h1>
                    <p className="text-xl opacity-90 animate-slide-in-right">Manage and organize your question bank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Questions</p>
                  <p className="text-3xl font-bold">{stats.totalQuestions || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  📊
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Questions</p>
                  <p className="text-3xl font-bold">{stats.activeQuestions || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  ✅
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">MCQ Questions</p>
                  <p className="text-3xl font-bold">{stats.mcqCount || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  🎯
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Other Types</p>
                  <p className="text-3xl font-bold">{stats.otherCount || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  📝
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></span>
            Question Management Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div
              onClick={() => setView('create')}
              className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 modern-card animate-scale-in"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                  Create New Question
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  Add a new question with multiple choice, true/false, or descriptive answers
                </p>
              </div>
              
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div
              onClick={() => setView('view')}
              className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 modern-card animate-scale-in"
              style={{animationDelay: '0.1s'}}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                  View All Questions
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  Browse, edit, and manage all existing questions for this class
                </p>
              </div>
              
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div
              onClick={() => {
                setView('inactive');
                loadInactiveQuestions();
              }}
              className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 modern-card animate-scale-in"
              style={{animationDelay: '0.2s'}}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Archive className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                  Inactive Questions
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  View and restore deleted or deactivated questions
                </p>
              </div>
              
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">💡</span>
            Question Management Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>Organize questions by subject and chapter for easy navigation</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>Use clear and concise language in your questions</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>Review and update questions regularly for accuracy</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>Include variety in question types to test different skills</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Question View
  if (view === 'create') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('menu')}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Menu</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                  <span className="text-white text-xl">➕</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold animate-fade-in">Create New Question</h1>
                  <p className="text-xl opacity-90 animate-slide-in-right">Class {selectedClass} • Build your question bank</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 animate-scale-in">
          <QuestionForm
            selectedClass={selectedClass}
            onSubmit={handleCreateQuestion}
            onCancel={() => setView('menu')}
          />
        </div>
      </div>
    );
  }

  // Edit Question View
  if (view === 'edit') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('menu')}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Menu</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                  <span className="text-white text-xl">✏️</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold animate-fade-in">Edit Question</h1>
                  <p className="text-xl opacity-90 animate-slide-in-right">Class {selectedClass} • Update your question</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 animate-scale-in">
          <QuestionForm
            question={editingQuestion}
            isEditing={true}
            selectedClass={selectedClass}
            onSubmit={handleEditQuestion}
            onCancel={() => setView('menu')}
          />
        </div>
      </div>
    );
  }

  // View Questions
  if (view === 'view') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView('menu')}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Menu</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold animate-fade-in">Question Bank</h1>
                    <p className="text-xl opacity-90 animate-slide-in-right">Class {selectedClass} • {questions.length} Questions</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setView('create')}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl px-6 py-3 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        </div>

        {/* Questions List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-scale-in">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></span>
              All Questions ({questions.length})
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 animate-reverse"></div>
                </div>
                <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading questions...</p>
                <p className="text-gray-500 mt-2">Please wait while we fetch your questions</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-4xl text-gray-400">📝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Found</h3>
                <p className="text-gray-500 mb-6">Start building your question bank for Class {selectedClass}</p>
                <button
                  onClick={() => setView('create')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Create First Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="group relative overflow-hidden bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            question.questionType === 'mcq' ? 'bg-blue-100 text-blue-800' :
                            question.questionType === 'true-false' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {question.questionType.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">{question.subject}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">Chapter {question.chapterNumber}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2">
                          {question.questionText}
                        </h3>
                      </div>
                    </div>

                    {/* Question Preview */}
                    {question.questionType === 'mcq' && question.options && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Options:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.slice(0, 2).map((option, idx) => (
                            <div key={idx} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 truncate">
                              {String.fromCharCode(65 + idx)}. {option.text || option}
                            </div>
                          ))}
                        </div>
                        {question.options.length > 2 && (
                          <p className="text-xs text-gray-500 mt-2">+{question.options.length - 2} more options</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Question #{index + 1}</span>
                        <span>•</span>
                        <span>Created recently</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditQuestion(question)}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {questions.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">⚡</span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setView('create')}
                className="flex items-center justify-center space-x-2 bg-white rounded-xl px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Question</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white rounded-xl px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 transform hover:scale-105 shadow-sm">
                <span>📊</span>
                <span>Export Questions</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white rounded-xl px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 shadow-sm">
                <span>📤</span>
                <span>Import Questions</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View Inactive Questions
  if (view === 'inactive') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView('menu')}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Menu</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold animate-fade-in">Inactive Questions</h1>
                    <p className="text-xl opacity-90 animate-slide-in-right">Class {selectedClass} • {inactiveQuestions.length} Inactive Questions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        </div>

        {/* Inactive Questions List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-scale-in">
          <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full mr-4"></span>
              Inactive Questions ({inactiveQuestions.length})
            </h2>
            {inactiveQuestions.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                These questions have been deleted or deactivated. You can restore them if needed.
              </p>
            )}
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-spin border-t-red-600"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600 animate-reverse"></div>
                </div>
                <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading inactive questions...</p>
                <p className="text-gray-500 mt-2">Please wait while we fetch inactive questions</p>
              </div>
            ) : inactiveQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Archive className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Inactive Questions</h3>
                <p className="text-gray-500 mb-6">Great! All your questions for Class {selectedClass} are active.</p>
                <button
                  onClick={() => setView('menu')}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Back to Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {inactiveQuestions.map((question, index) => (
                  <div
                    key={question._id}
                    className="group relative overflow-hidden bg-red-50 rounded-xl border-2 border-red-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    {/* Inactive Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        INACTIVE
                      </span>
                    </div>

                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4 pr-20">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            question.questionType === 'mcq' ? 'bg-blue-100 text-blue-800' :
                            question.questionType === 'true-false' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {question.questionType.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">{question.subject}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">Chapter {question.chapterNumber}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 line-clamp-2 opacity-75">
                          {question.questionText}
                        </h3>
                      </div>
                    </div>

                    {/* Question Preview */}
                    {question.questionType === 'mcq' && question.options && (
                      <div className="mb-4 opacity-60">
                        <p className="text-sm text-gray-600 mb-2">Options:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.slice(0, 2).map((option, idx) => (
                            <div key={idx} className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2 truncate">
                              {String.fromCharCode(65 + idx)}. {option.text || option}
                            </div>
                          ))}
                        </div>
                        {question.options.length > 2 && (
                          <p className="text-xs text-gray-500 mt-2">+{question.options.length - 2} more options</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Question #{index + 1}</span>
                        <span>•</span>
                        <span>Deleted</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRestoreQuestion(question._id)}
                          className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(question._id)}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>

                    {/* Inactive Overlay */}
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Note */}
        {inactiveQuestions.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm mr-3">⚠️</span>
              Important Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span><strong>Restore:</strong> Makes the question active and visible again</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span><strong>Delete Forever:</strong> Permanently removes the question (cannot be undone)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ClassQuestionManager;
