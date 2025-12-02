import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { testService } from '../../services/testService';

export default function CreateTestScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Test details, 2: Questions

  const handleSetNumQuestions = () => {
    const num = parseInt(numQuestions);
    if (isNaN(num) || num <= 0 || num > 50) {
      Alert.alert('Error', 'Please enter a valid number of questions (1-50)');
      return;
    }

    // Initialize questions array
    const newQuestions = Array.from({ length: num }, (_, i) => ({
      questionNumber: i + 1,
      questionText: '',
      marks: 1,
      options: [
        { letter: 'A', text: '', isCorrect: false },
        { letter: 'B', text: '', isCorrect: false },
        { letter: 'C', text: '', isCorrect: false },
        { letter: 'D', text: '', isCorrect: false },
      ],
    }));

    setQuestions(newQuestions);
    setStep(2);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    // Unset all options first
    updated[questionIndex].options.forEach(opt => opt.isCorrect = false);
    // Set the selected option as correct
    updated[questionIndex].options[optionIndex].isCorrect = true;
    setQuestions(updated);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        Alert.alert('Error', `Please enter question text for Question ${i + 1}`);
        return false;
      }

      let hasCorrect = false;
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          Alert.alert('Error', `Please enter all options for Question ${i + 1}`);
          return false;
        }
        if (q.options[j].isCorrect) {
          hasCorrect = true;
        }
      }

      if (!hasCorrect) {
        Alert.alert('Error', `Please mark the correct answer for Question ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleCreateTest = async () => {
    if (step === 1) {
      if (!title || !subject || !totalMarks) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      const marks = parseInt(totalMarks);
      if (isNaN(marks) || marks <= 0) {
        Alert.alert('Error', 'Please enter a valid total marks');
        return;
      }

      if (!numQuestions) {
        Alert.alert('Error', 'Please enter number of questions');
        return;
      }

      handleSetNumQuestions();
      return;
    }

    // Step 2: Validate and create test
    if (!validateQuestions()) {
      return;
    }

    setLoading(true);
    try {
      // Format questions for API
      const formattedQuestions = questions.map((q, index) => ({
        questionText: q.questionText,
        questionNumber: q.questionNumber,
        marks: q.marks || 1,
        options: q.options.map(opt => ({
          optionText: opt.text,
          optionLetter: opt.letter,
          isCorrect: opt.isCorrect,
        })),
      }));

      const { data: testData, error: testError } = await testService.createTest(
        title,
        subject,
        parseInt(totalMarks),
        formattedQuestions,
        startDate ? new Date(startDate) : new Date(),
        endDate ? new Date(endDate) : null
      );

      if (testError) {
        Alert.alert('Error', testError.message);
        setLoading(false);
        return;
      }

      // Add questions and options
      const { error: questionsError } = await testService.addQuestionsToTest(
        testData.id,
        questions
      );

      if (questionsError) {
        Alert.alert('Error', questionsError.message);
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Test created successfully with all questions!', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setSubject('');
            setTotalMarks('');
            setNumQuestions('');
            setQuestions([]);
            setStep(1);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Create New Test</Text>

        <TextInput
          style={styles.input}
          placeholder="Test Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
        />

        <TextInput
          style={styles.input}
          placeholder="Total Marks"
          value={totalMarks}
          onChangeText={setTotalMarks}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Number of Questions"
          value={numQuestions}
          onChangeText={setNumQuestions}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD) - Optional"
          value={startDate}
          onChangeText={setStartDate}
        />

        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD) - Optional"
          value={endDate}
          onChangeText={setEndDate}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateTest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Next: Add Questions</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Add Questions</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.testInfo}>
        {title} - {subject} ({totalMarks} marks)
      </Text>

      {questions.map((question, qIndex) => (
        <View key={qIndex} style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {question.questionNumber}</Text>

          <TextInput
            style={styles.questionInput}
            placeholder="Enter question text"
            value={question.questionText}
            onChangeText={(text) => updateQuestion(qIndex, 'questionText', text)}
            multiline
          />

          <Text style={styles.optionsLabel}>Options (tap to mark correct answer):</Text>

          {question.options.map((option, oIndex) => (
            <TouchableOpacity
              key={oIndex}
              style={[
                styles.optionRow,
                option.isCorrect && styles.optionRowCorrect,
              ]}
              onPress={() => setCorrectOption(qIndex, oIndex)}
            >
              <View style={styles.optionLetterContainer}>
                <Text
                  style={[
                    styles.optionLetter,
                    option.isCorrect && styles.optionLetterCorrect,
                  ]}
                >
                  {option.letter}
                </Text>
              </View>
              <TextInput
                style={styles.optionInput}
                placeholder={`Option ${option.letter}`}
                value={option.text}
                onChangeText={(text) =>
                  updateOption(qIndex, oIndex, 'text', text)
                }
                onFocus={() => {
                  // Don't set as correct when typing
                }}
              />
              {option.isCorrect && (
                <Text style={styles.correctBadge}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateTest}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Test</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c96aeff',
    padding: 20,
    marginTop: 25,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  testInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffffa5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  questionCard: {
    backgroundColor: '#ffffffb6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#e8e2e23e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  questionInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionRowCorrect: {
    borderColor: '#1e5ca3ff',
    backgroundColor: '#e8f5e9',
  },
  optionLetterContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  optionLetterCorrect: {
    color: '#123c8aff',
  },
  optionInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  correctBadge: {
    fontSize: 20,
    color: '#34c759',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#1a4a84ff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
