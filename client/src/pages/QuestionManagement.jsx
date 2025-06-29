import React, { useState, useEffect } from 'react';
import ClassSelector from '@/components/ClassSelector';
import ClassQuestionManager from '@/components/ClassQuestionManager';
import { questionAPI } from '@/lib/api';

const QuestionManagement = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStats, setClassStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClassStats();
  }, []);

  const loadClassStats = async () => {
    setLoading(true);
    try {
      const response = await questionAPI.getQuestionStats();
      setClassStats(response.data.classDistribution || []);
    } catch (error) {
      console.error('Failed to load class stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classNum) => {
    setSelectedClass(classNum);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    loadClassStats(); // Refresh stats when going back
  };

  const handleStatsRefresh = () => {
    loadClassStats(); // Refresh stats when called from child component
  };

  if (selectedClass) {
    return (
      <ClassQuestionManager 
        selectedClass={selectedClass} 
        onBack={handleBackToClasses}
        onStatsRefresh={handleStatsRefresh}
      />
    );
  }

  return (
    <ClassSelector 
      onClassSelect={handleClassSelect}
      selectedClass={selectedClass}
      stats={classStats}
      loading={loading}
    />
  );
};

export default QuestionManagement;
