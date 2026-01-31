import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, RefreshControl, ListRenderItem, Image, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Item, RootStackParamList } from '../types';
import { COLORS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AnalyticsCard from '../components/AnalyticsCard';

// API URL - Using 10.0.2.2 for Android Emulator to access localhost
const API_URL = 'http://10.0.2.2:5000/items';

const FILTERS = ["All Tasks", "In Progress", "Pending", "Done"];

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState("All Tasks");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchItems = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.success) {
                setItems(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchItems();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchItems();
    };

    // Analytics Stats
    const totalTasks = items.length;
    const pendingTasks = items.filter(i => i.status === 'active').length; // Assuming active = pending
    const completedTasks = items.filter(i => i.status === 'completed').length;

    const getFilteredItems = () => {
        let filtered = items;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.vehicle_number?.toLowerCase().includes(lowerQuery)
            );
        }

        if (activeFilter === "All Tasks") return filtered;
        if (activeFilter === "Done") return filtered.filter(i => i.status === "completed");
        if (activeFilter === "In Progress") return filtered.filter(i => i.status === "active");
        if (activeFilter === "Pending") return [];

        return filtered;
    };

    const renderItem: ListRenderItem<Item> = ({ item }) => {
        const isCompleted = item.status === 'completed';
        const badgeStyle = isCompleted ? COLORS.badge.done : COLORS.badge.inProgress;
        const statusText = isCompleted ? "Done" : "In Progress";

        const formattedDate = item.due_date
            ? `Due: ${new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
            : new Date(item.entry_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Detail', { itemId: item.id })}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{statusText}</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.text.light} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

                <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.cardFooter}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.text.secondary} />
                        <Text style={[styles.dateText, item.due_date && { color: COLORS.danger }]}>
                            {formattedDate}
                        </Text>
                    </View>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.vehicle_number ? item.vehicle_number.charAt(0) : '?'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.dateHeader}>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
                </Text>
                <View style={styles.titleRow}>
                    <Text style={styles.headerTitle}>My Tasks</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('Create')}
                    >
                        <Ionicons name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                ListHeaderComponent={
                    <>
                        {/* Analytics Dashboard */}
                        <AnalyticsCard total={totalTasks} pending={pendingTasks} done={completedTasks} />

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#999"
                                clearButtonMode="while-editing"
                            />
                        </View>

                        {/* Filter Tabs */}
                        <View style={styles.filterContainer}>
                            <FlatList
                                horizontal
                                data={FILTERS}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 20 }}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.filterTab,
                                            activeFilter === item && styles.filterTabActive
                                        ]}
                                        onPress={() => setActiveFilter(item)}
                                    >
                                        <Text style={[
                                            styles.filterText,
                                            activeFilter === item && styles.filterTextActive
                                        ]}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </>
                }
                data={getFilteredItems()}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No filtered tasks found</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    dateHeader: {
        fontSize: 13,
        color: COLORS.text.secondary,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D1E3FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text.primary,
        height: '100%',
    },
    filterContainer: {
        paddingVertical: 10,
        marginBottom: 4,
    },
    filterTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    filterTabActive: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.text.secondary,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    loadingContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 20,
        ...SHADOWS.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 6,
        color: COLORS.text.secondary,
        fontSize: 13,
        fontWeight: '500',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFD8B1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#E65100',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.text.light,
        fontSize: 16,
    },
});

export default HomeScreen;
