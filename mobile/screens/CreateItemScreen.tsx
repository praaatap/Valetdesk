import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { RootStackParamList } from '../types';

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
            Alert.alert("Missing Fields", "Title and Vehicle Number are required.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(API_URL, formData);
            if (response.data.success) {
                Alert.alert("Success", "Ticket created successfully");
                navigation.goBack();
            } else {
                Alert.alert("Error", response.data.error || "Failed to create ticket");
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Ticket</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>TITLE / OWNER NAME</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Blue Ford Mustang"
                        placeholderTextColor="#ccc"
                        value={formData.title}
                        onChangeText={(t) => updateField('title', t)}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flexHalf]}>
                        <Text style={styles.label}>VEHICLE PLATE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MH12AB1234"
                            placeholderTextColor="#ccc"
                            value={formData.vehicle_number}
                            onChangeText={(t) => updateField('vehicle_number', t)}
                            autoCapitalize="characters"
                        />
                    </View>
                    <View style={[styles.inputGroup, styles.flexHalf]}>
                        <Text style={styles.label}>LEVEL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 2"
                            placeholderTextColor="#ccc"
                            value={formData.level}
                            onChangeText={(t) => updateField('level', t)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>SLOT NUMBER</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. A-42"
                        placeholderTextColor="#ccc"
                        value={formData.slot}
                        onChangeText={(t) => updateField('slot', t)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>DESCRIPTION / NOTES</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Add any parking notes here..."
                        placeholderTextColor="#ccc"
                        value={formData.description}
                        onChangeText={(t) => updateField('description', t)}
                        multiline
                        numberOfLines={4}
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
                        <Text style={styles.submitButtonText}>Create Ticket</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    closeButton: {
        paddingVertical: 8,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#666',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    formContent: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1a1a1a',
        backgroundColor: '#fafafa',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexHalf: {
        width: '48%',
    },
    submitButton: {
        backgroundColor: '#007bff',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#a0cfff',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CreateItemScreen;
