import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { testService } from '../../services/testService';

export default function TestsScreen({ navigation }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      loadTestQuestions();
    }
  }, [selectedTest]);

  const loadTests = async () => {
    const { data, error } = await testService.getAllTests();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setTests(data || []);
    }
    setLoading(false);
  };

  const loadTestQuestions = async () => {
    setLoading(true);
    const { data, error } = await testService.getTestWithQuestions(selectedTest.id);
    if (error) {
      Alert.alert('Error', error.message);
      setSelectedTest(null);
    } else {
      setTestData(data);
      // Initialize answers
      const initialAnswers = {};
      data.questions.forEach((q) => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    }
    setLoading(false);
  };

  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const calculateScore = () => {
    if (!testData) return 0;

    let correctCount = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    testData.questions.forEach((question) => {
      totalMarks += question.marks || 1;
      const selectedOptionId = answers[question.id];
      
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          (opt) => opt.id === selectedOptionId
        );
        if (selectedOption && selectedOption.is_correct) {
          correctCount++;
          obtainedMarks += question.marks || 1;
        }
      }
    });

    // Calculate percentage
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    return {
      correctCount,
      totalQuestions: testData.questions.length,
      obtainedMarks,
      totalMarks,
      percentage: percentage.toFixed(2),
    };
  };

  const handleSubmitTest = async () => {
    const unanswered = testData.questions.filter(
      (q) => !answers[q.id]
    );

    if (unanswered.length > 0) {
      Alert.alert(
        'Unanswered Questions',
        `You have ${unanswered.length} unanswered question(s). Do you want to submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => submitTest(),
          },
        ]
      );
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setSubmitting(true);
    const score = calculateScore();

    // Prepare answers for submission
    const answersToSubmit = testData.questions.map((question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = question.options.find(
        (opt) => opt.id === selectedOptionId
      );

      return {
        questionId: question.id,
        selectedOptionId: selectedOptionId,
        isCorrect: selectedOption ? selectedOption.is_correct : false,
      };
    });

    const { error } = await testService.submitTestResult(
      selectedTest.id,
      answersToSubmit,
      parseFloat(score.percentage)
    );

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Test Submitted!',
        `Score: ${score.obtainedMarks}/${score.totalMarks} (${score.percentage}%)\nCorrect: ${score.correctCount}/${score.totalQuestions}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedTest(null);
              setTestData(null);
              setAnswers({});
              setCurrentQuestionIndex(0);
              loadTests();
            },
          },
        ]
      );
    }
    setSubmitting(false);
  };

  if (loading && !testData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (testData && selectedTest) {
    const currentQuestion = testData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / testData.questions.length) * 100;
    const answeredCount = Object.values(answers).filter((a) => a !== null).length;

    return (
      <View style={styles.container}>
        <View style={styles.testHeader}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Exit Test',
                'Are you sure you want to exit? Your progress will be lost.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Exit',
                    onPress: () => {
                      setSelectedTest(null);
                      setTestData(null);
                      setAnswers({});
                      setCurrentQuestionIndex(0);
                    },
                  },
                ]
              );
            }}
            style={styles.exitButton}
          >
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.testTitle}>{testData.title}</Text>
            <Text style={styles.testSubject}>{testData.subject}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {testData.questions.length}
            {' '}({answeredCount} answered)
          </Text>
        </View>

        <ScrollView style={styles.questionContainer}>
          <View style={styles.questionCard}>
            <Text style={styles.questionNumber}>
              Question {currentQuestion.question_number}
            </Text>
            <Text style={styles.questionText}>
              {currentQuestion.question_text}
            </Text>
            <Text style={styles.marksText}>
              Marks: {currentQuestion.marks || 1}
            </Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  >
                    <View style={styles.optionContent}>
                      <View
                        style={[
                          styles.optionCircle,
                          isSelected && styles.optionCircleSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.optionCircleInner} />
                        )}
                      </View>
                      <Text style={styles.optionLetter}>{option.option_letter}.</Text>
                      <Text style={styles.optionText}>{option.option_text}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          {currentQuestionIndex < testData.questions.length - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                setCurrentQuestionIndex(
                  Math.min(
                    testData.questions.length - 1,
                    currentQuestionIndex + 1
                  )
                )
              }
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleSubmitTest}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.navButtonText}>Submit Test</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Tests</Text>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.testCard}
            onPress={() => setSelectedTest(item)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubject}>{item.subject}</Text>
            <Text style={styles.cardMarks}>Total: {item.total_marks} marks</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tests available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9ec1a7ff',
    padding: 20,
    marginTop: 25,

  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a237e',
  },
  testCard: {
    backgroundColor: '#ffffff99',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#c0b5b595',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubject: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  cardMarks: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  exitButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  testSubject: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34c759',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
    lineHeight: 26,
  },
  marksText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: '#007AFF',
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
    minWidth: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#34c759',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
