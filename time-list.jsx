import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as Database from './database.jsx';

class TimeList extends Component {
    state = {
        times: [],
        loading: true,
    };
    subs = [];

    async componentDidMount() {
        try {
            const db = await Database.get();
            const sub = db.times.find({
                selector: {},
                sort: [{ name: 'asc' }]
            }).$.subscribe(times => {
                console.log('RxDB times:', times);
                if (!Array.isArray(times)) {
                    this.setState({ times: [], loading: false });
                    return;
                }
                this.setState({
                    times,
                    loading: false
                });
            });
            this.subs.push(sub);
        } catch (e) {
            console.error('DB error:', e);
            this.setState({ times: [], loading: false });
        }
    }

    render() {
        const { times, loading } = this.state;
        return (
            <View>
                <Text>Heroes</Text>
                {loading && <Text>Loading...</Text>}
                {!loading && times.length === 0 && <Text>No heroes</Text>}
                {!loading && times.length > 0 &&
                    times.map(time => (
                        <View key={time.id} style={{ marginVertical: 4 }}>
                            <Text>{time.name}</Text>
                        </View>
                    ))
                }
            </View>
        );
    }
}

export default TimeList;