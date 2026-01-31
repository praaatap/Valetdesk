import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Item, RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

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
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure?",
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
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (pageError || !item) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{pageError || "Unknown Error"}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: COLORS.primary }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isCompleted = item.status === 'completed';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Task Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Title Section */}
                <Text style={styles.title}>{item.title}</Text>

                <View style={styles.tagsRow}>
                    {!isCompleted && (
                        <View style={[styles.pill, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                            <Text style={[styles.pillText, { color: COLORS.danger }]}>High Priority</Text>
                        </View>
                    )}
                    <View style={[styles.pill, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="play-circle" size={16} color={COLORS.primary} />
                        <Text style={[styles.pillText, { color: COLORS.primary }]}>
                            {isCompleted ? "Done" : "In Progress"}
                        </Text>
                    </View>
                </View>

                {/* Grid Info */}
                <View style={styles.gridRow}>
                    <View style={styles.gridItem}>
                        <Ionicons name="calendar-outline" size={20} color={COLORS.text.secondary} style={styles.gridIcon} />
                        <View>
                            <Text style={styles.gridLabel}>DUE DATE</Text>
                            <Text style={styles.gridValue}>
                                {new Date(item.entry_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.gridItem}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.vehicle_number ? item.vehicle_number.charAt(0) : '?'}</Text>
                        </View>
                        <View>
                            <Text style={styles.gridLabel}>ASSIGNED TO</Text>
                            <Text style={styles.gridValue} numberOfLines={1}>{item.vehicle_number || "Unassigned"}</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.descriptionHeader}>
                    <Ionicons name="document-text" size={18} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Description</Text>
                </View>

                <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>
                        {item.description || "No description provided for this task."}
                    </Text>

                    <Text style={styles.contextText}>
                        Needs investigation on the backend validation logic and potential regression testing for the auth module.
                    </Text>
                </View>

                {/* Attachments Mock */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>ATTACHMENTS</Text>
                <View style={styles.attachmentRow}>
                    <View style={styles.attachmentCard}>
                        <Ionicons name="image" size={24} color={COLORS.text.light} />
                        <Text style={styles.attachmentText}>error_log.png</Text>
                    </View>
                    <View style={styles.attachmentCard}>
                        <Ionicons name="document" size={24} color={COLORS.text.light} />
                        <Text style={styles.attachmentText}>specs.pdf</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Floating Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.editButton} onPress={handleDelete}>
                    <Text style={styles.editButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.completeButton, isCompleted && { backgroundColor: COLORS.success }]}
                    onPress={handleMarkCompleted}
                    disabled={isCompleted}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.completeButtonText}>{isCompleted ? "Completed" : "Mark Complete"}</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.danger,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 16,
    },
    tagsRow: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    pillText: {
        fontSize: 13,
        fontWeight: '600',
    },
    gridRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 30,
    },
    gridItem: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    gridIcon: {
        opacity: 0.6,
    },
    gridLabel: {
        fontSize: 11,
        color: COLORS.text.secondary,
        fontWeight: '700',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    gridValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    descriptionBox: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 12,
    },
    descriptionText: {
        color: COLORS.text.primary,
        lineHeight: 22,
        fontSize: 15,
        marginBottom: 16,
    },
    contextText: {
        color: COLORS.text.secondary,
        lineHeight: 20,
        fontSize: 14,
    },
    attachmentRow: {
        flexDirection: 'row',
        gap: 16,
    },
    attachmentCard: {
        width: 100,
        height: 100,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    attachmentText: {
        fontSize: 10,
        marginTop: 8,
        color: COLORS.text.secondary,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 16,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    completeButton: {
        flex: 2,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    }
});

export default DetailScreen;
