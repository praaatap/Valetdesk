import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://10.0.2.2:5000/items';

type CreateFormData = {
    title: string;
    description: string;
    vehicle_number: string;
    slot: string;
    level: string;
};

const CreateItemScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState<boolean>(false);

    // Form state
    const [formData, setFormData] = useState<CreateFormData>({
        title: '',
        description: '',
        vehicle_number: '',
        slot: '',
        level: '',
    });

    const updateField = (key: keyof CreateFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.vehicle_number) {
            Alert.alert("Missing Fields", "Topic and Assigned To are required.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(API_URL, formData);
            if (response.data.success) {
                Alert.alert("Success", "Task created successfully");
                navigation.goBack();
            } else {
                Alert.alert("Error", response.data.error || "Failed to create task");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Icon Placeholder */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkbox" size={32} color={COLORS.primary} />
                    </View>
                </View>

                <Text style={styles.pageTitle}>Create New Task</Text>
                <Text style={styles.pageSubtitle}>Enter the details below to add to the list.</Text>

                {/* Form */}
                <View style={styles.formContainer}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Task Title <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Fix navigation bug"
                            placeholderTextColor="#ccc"
                            value={formData.title}
                            onChangeText={(t) => updateField('title', t)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Assigned To / Vehicle <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Alex Johnson (or Plate No)"
                            placeholderTextColor="#ccc"
                            value={formData.vehicle_number}
                            onChangeText={(t) => updateField('vehicle_number', t)}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.flexHalf]}>
                            <Text style={styles.label}>Level</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 2"
                                placeholderTextColor="#ccc"
                                value={formData.level}
                                onChangeText={(t) => updateField('level', t)}
                            />
                        </View>
                        <View style={[styles.inputGroup, styles.flexHalf]}>
                            <Text style={styles.label}>Slot</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. A-12"
                                placeholderTextColor="#ccc"
                                value={formData.slot}
                                onChangeText={(t) => updateField('slot', t)}
                            />
                        </View>
                    </View>


                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter detailed description here..."
                            placeholderTextColor="#ccc"
                            value={formData.description}
                            onChangeText={(t) => updateField('description', t)}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Task</Text>
                        )}
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray background
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    content: {
        paddingBottom: 40,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    pageSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: COLORS.text.secondary,
        marginBottom: 32,
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: COLORS.danger,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexHalf: {
        width: '48%',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: '#A0CFFF',
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CreateItemScreen;
