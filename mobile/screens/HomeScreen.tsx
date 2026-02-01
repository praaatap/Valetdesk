import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, RefreshControl, ListRenderItem, Image, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Item, RootStackParamList } from '../types';
import { COLORS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AnalyticsCard from '../components/AnalyticsCard';

import { ITEMS_URL } from '../constants/api';

const API_URL = ITEMS_URL;

const FILTERS = ["All Tasks", "Active", "Completed"];

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
        if (activeFilter === "Completed") return filtered.filter(i => i.status === "completed");
        if (activeFilter === "Active") return filtered.filter(i => i.status === "active");

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
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* Hero Section */}
            <View style={styles.heroContainer}>
                <View style={styles.heroContent}>
                    <View style={styles.heroLeft}>
                        <Text style={styles.welcomeText}>Welcome back, Guest</Text>
                        <Text style={styles.heroTitle}>Manage Your{"\n"}Daily Valet</Text>
                        <View style={styles.heroBadge}>
                            <Ionicons name="flash" size={12} color="#FFF" />
                            <Text style={styles.heroBadgeText}>Pro Dashboard</Text>
                        </View>
                    </View>

                    <View style={styles.heroRight}>
                        <View style={styles.progressWidget}>
                            <View style={styles.progressInfo}>
                                <Text style={styles.progressValue}>{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</Text>
                                <Text style={styles.progressLabel}>Done</Text>
                            </View>
                            <TouchableOpacity style={styles.miniProfile}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <FlatList
                ListHeaderComponent={
                    <>
                        {/* Search & Actions Bar */}
                        <View style={styles.actionRow}>
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
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => navigation.navigate('Create')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={28} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Analytics Dashboard */}
                        <AnalyticsCard total={totalTasks} pending={pendingTasks} done={completedTasks} />

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
    heroContainer: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...SHADOWS.card,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    heroContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroLeft: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        lineHeight: 34,
        letterSpacing: -0.5,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 12,
        gap: 6,
    },
    heroBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    heroRight: {
        alignItems: 'center',
    },
    progressWidget: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressInfo: {
        alignItems: 'center',
    },
    progressValue: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '700',
    },
    miniProfile: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#FFF',
        padding: 2,
        ...SHADOWS.card,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 10,
        marginTop: -24, // Pull it into the hero area slightly
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.card,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        ...SHADOWS.card,
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
