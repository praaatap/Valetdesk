import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Item, RootStackParamList } from '../types';

// API URL - Replace with your machine's IP
const API_URL = 'http://10.0.2.2:5000/items';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<DetailScreenRouteProp>();
    const { itemId } = route.params;

    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchDetails();
    }, [itemId]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/${itemId}`);
            if (response.data.success) {
                setItem(response.data.data);
            } else {
                setPageError("Item not found");
            }
        } catch (err) {
            setPageError("Failed to load details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Ticket",
            "Are you sure you want to delete this ticket? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            const response = await axios.delete(`${API_URL}/${itemId}`);
                            if (response.data.success) {
                                navigation.goBack();
                            } else {
                                Alert.alert("Error", "Failed to delete item");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Could not delete item");
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleMarkCompleted = async () => {
        setActionLoading(true);
        try {
            const response = await axios.patch(`${API_URL}/${itemId}`, { status: 'completed' });
            if (response.data.success) {
                setItem(prev => prev ? { ...prev, status: 'completed' } : null);
                Alert.alert("Success", "Ticket marked as completed");
            }
        } catch (error) {
            Alert.alert("Error", "Could not update status");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (pageError || !item) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{pageError || "Unknown Error"}</Text>
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

                <View style={[styles.card, item.status === 'completed' && styles.cardDimmed]}>
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
                                {new Date(item.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

                <View style={styles.actionsContainer}>
                    {item.status === 'active' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.completeButton]}
                            onPress={handleMarkCompleted}
                            disabled={actionLoading}
                        >
                            <Text style={styles.actionButtonText}>✓ Mark Completed</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleDelete}
                        disabled={actionLoading}
                    >
                        <Text style={[styles.actionButtonText, styles.deleteText]}>Delete Ticket</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.qrPlaceholder}>
                    <Text style={styles.qrText}>ID: {item.id}</Text>
                </View>

            </ScrollView>

            {actionLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
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
    cardDimmed: {
        opacity: 0.8,
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
    },
    actionsContainer: {
        marginTop: 24,
        gap: 12,
    },
    actionButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeButton: {
        backgroundColor: '#00b894',
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ffdddd',
    },
    actionButtonText: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
    },
    deleteText: {
        color: '#ff4444',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default DetailScreen;
