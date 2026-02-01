import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
            <View style={styles.headerRow}>
                <Text style={styles.header}>Overview</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>Stats</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={160}
            >

                {/* Total Card */}
                <View style={[styles.card, { backgroundColor: COLORS.primary }]}>
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons name="grid" size={18} color="#fff" />
                    </View>
                    <View>
                        <Text style={[styles.value, { color: '#fff' }]}>{total}</Text>
                        <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>Total</Text>
                    </View>
                </View>

                {/* Pending Card */}
                <View style={styles.card}>
                    <View style={[styles.iconCircle, { backgroundColor: COLORS.badge.pending.bg }]}>
                        <Ionicons name="time" size={18} color={COLORS.badge.pending.text} />
                    </View>
                    <View>
                        <Text style={styles.value}>{pending}</Text>
                        <Text style={styles.label}>Active</Text>
                    </View>
                </View>

                {/* Done Card */}
                <View style={styles.card}>
                    <View style={[styles.iconCircle, { backgroundColor: COLORS.badge.done.bg }]}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.badge.done.text} />
                    </View>
                    <View>
                        <Text style={styles.value}>{done}</Text>
                        <Text style={styles.label}>Done</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    seeAll: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
        paddingBottom: 4, // Space for shadow
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        paddingRight: 20,
        gap: 12,
        minWidth: 140,
        ...SHADOWS.card,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    label: {
        fontSize: 13,
        color: COLORS.text.secondary,
        fontWeight: '600',
        marginTop: -2,
    },
});

export default AnalyticsCard;
