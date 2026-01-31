import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, RefreshControl, ListRenderItem } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Item, RootStackParamList } from '../types';

// API URL - Using 10.0.2.2 for Android Emulator to access localhost
const API_URL = 'http://10.0.2.2:5000/items';

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

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

    // Refresh when navigating back to screen (simple way to sync data)
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

    const renderItem: ListRenderItem<Item> = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, item.status === 'completed' && styles.cardCompleted]}
            onPress={() => navigation.navigate('Detail', { itemId: item.id })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, item.status === 'completed' && styles.textCompleted]}>{item.title}</Text>
                <StatusBadge status={item.status} />
            </View>
            <Text style={styles.cardInfo} numberOfLines={1}>
                {item.vehicle_number} • Level {item.level} • Slot {item.slot}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
            </Text>
            <View style={styles.cardFooter}>
                <Text style={styles.timestamp}>
                    {new Date(item.entry_time).toLocaleDateString()} • {new Date(item.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const StatusBadge = ({ status }: { status: string }) => {
        const isCompleted = status === 'completed';
        return (
            <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgeActive]}>
                <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextActive]}>
                    {status ? status.toUpperCase() : 'UNKNOWN'}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ValetDesk</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Create')}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tickets found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        letterSpacing: -0.5,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: -2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardCompleted: {
        backgroundColor: '#f9f9f9',
        borderColor: '#eee',
        shadowOpacity: 0,
        elevation: 0,
    },
    textCompleted: {
        color: '#aaa',
        textDecorationLine: 'line-through'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 8,
    },
    cardInfo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeActive: {
        backgroundColor: '#e6f2ff',
    },
    badgeCompleted: {
        backgroundColor: '#e6fffa',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    badgeTextActive: {
        color: '#007bff',
    },
    badgeTextCompleted: {
        color: '#00b894',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});

export default HomeScreen;
