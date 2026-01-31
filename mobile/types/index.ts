export interface Item {
    id: string;
    title: string;
    description: string;
    vehicle_number: string;
    slot: string;
    level: string;
    entry_time: string;
    status: 'active' | 'completed';
}

export type RootStackParamList = {
    Home: undefined;
    Detail: { itemId: string };
    Create: undefined;
};
