import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type AnalyticsCardProps = {
    total: number;
    pending: number;
    done: number;
};

const AnalyticsCard = ({ total, pending, done }: AnalyticsCardProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Overview</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Pending Card */}
                <View style={[styles.card, styles.cardPending]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="time" size={20} color="#FF9500" />
                    </View>
                    <View>
                        <Text style={styles.value}>{pending}</Text>
                        <Text style={styles.label}>Pending</Text>
                    </View>
                </View>

                {/* Done Card */}
                <View style={[styles.card, styles.cardDone]}>
                    <View style={[styles.iconCircle, { backgroundColor: '#E8FAEF' }]}>
                        <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                    </View>
                    <View>
                        <Text style={styles.value}>{done}</Text>
                        <Text style={styles.label}>Completed</Text>
                    </View>
                </View>

                {/* Total Card */}
                <View style={[styles.card, styles.cardTotal]}>
                    <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="grid" size={20} color="#007AFF" />
                    </View>
                    <View>
                        <Text style={styles.value}>{total}</Text>
                        <Text style={styles.label}>Total Tasks</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        paddingRight: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        minWidth: 140,
        ...SHADOWS.card,
    },
    cardPending: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF9500',
    },
    cardDone: {
        borderLeftWidth: 4,
        borderLeftColor: '#34C759',
    },
    cardTotal: {
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF8E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    label: {
        fontSize: 12,
        color: COLORS.text.secondary,
        fontWeight: '600',
    },
});

export default AnalyticsCard;
