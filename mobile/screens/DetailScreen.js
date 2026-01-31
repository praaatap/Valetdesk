import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// API URL - Replace with your machine's IP
const API_URL = 'http://10.0.2.2:5000/items';

const DetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemId } = route.params;

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/${itemId}`);
                if (response.data.success) {
                    setItem(response.data.data);
                } else {
                    setError("Item not found");
                }
            } catch (err) {
                setError("Failed to load details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [itemId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (error || !item) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error || "Unknown Error"}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBack}>
                    <Text style={styles.navBackText}>← Back</Text>
                </TouchableOpacity>
                
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={[styles.statusBadge, item.status === 'completed' ? styles.completed : styles.active]}>
                            <Text style={[styles.statusText, item.status === 'completed' ? styles.completedText : styles.activeText]}>
                                {item.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.label}>DESCRIPTION</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>VEHICLE NO.</Text>
                            <Text style={styles.value}>{item.vehicle_number || "N/A"}</Text>
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>ENTRY TIME</Text>
                            <Text style={styles.value}>
                                {new Date(item.entry_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>LEVEL</Text>
                            <Text style={styles.value}>{item.level || "-"}</Text>
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>SLOT</Text>
                            <Text style={styles.value}>{item.slot || "-"}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.qrPlaceholder}>
                   <Text style={styles.qrText}>ID: {item.id}</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navBack: {
        marginBottom: 20,
    },
    navBackText: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    active: {
        backgroundColor: '#e6f2ff',
    },
    completed: {
        backgroundColor: '#e6fffa',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeText: {
        color: '#007bff',
    },
    completedText: {
        color: '#00b894',
    },
    label: {
        fontSize: 11,
        color: '#999',
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    infoCol: {
        flex: 1,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    qrPlaceholder: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    qrText: {
        color: '#aaa',
        fontFamily: 'monospace',
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        marginBottom: 16,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: '600',
    }
});

export default DetailScreen;
