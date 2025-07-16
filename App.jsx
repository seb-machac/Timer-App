import { useState, useRef, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import { initDB, insertTime, getTimes, clearTimes } from './testdatabase.js';





// const reference = firebase
//   .app()
//   .database('https://timer-app-89dd6-default-rtdb.firebaseio.com/')
//   .ref('/users/123');


const App = () => {
    
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);
    const [records, setRecords] = useState([]);


    
    //const uri = "mongodb+srv://sebmachac2:Mason1234!@cluster0.5zi2agb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // const client = new MongoClient(uri, {
    //   serverApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    //   }
    // });
    
    // async function connect() {
    //     try {
    //       // Connect the client to the server	(optional starting in v4.7)
    //       await client.connect();
    //       // Send a ping to confirm a successful connection
    //       await client.db("admin").command({ ping: 1 });
    //       console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //     } finally {
    //       // Ensures that the client will close when you finish/error
    //       await client.close();
    //     }
    //   }

    useEffect(() => {
        initDB();
        fetchTimes();
    }, []);

    const saveTime = () => {
        const formatted = formatTime(time);
        insertTime(formatted);
        fetchTimes();
    };

    const fetchTimes = () => {
        getTimes((data) => {
            console.log("Fetched times:", data);
            setRecords(data);
        });
    };


    const StartStopwatch = () => {
        startTimeRef.current = Date.now() - time;
        intervalRef.current = setInterval(() => {
            setTime(Date.now() - startTimeRef.current);
        }, 10);
        setRunning(true);
    };

    const pauseStopwatch = () => {
        clearInterval(intervalRef.current);
        setRunning(false);
    };

    const resetStopwatch = () => {
        clearInterval(intervalRef.current);
        setTime(0);
        setRunning(false);
        fetchTimes();
    };

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return (
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0') + ':' +
            String(milliseconds).padStart(2, '0')
        );
    };

    // const addHero = async () => {
    //     try {
    //         const db = await Database.get();
    //         await db.times.insert({
    //             id: String(Date.now()),
    //             name: 'New Hero ' + Date.now()
    //         });
    //         const allHeroes = await db.times.find().exec();
    //         console.log('Current heroes:', allHeroes.map(hero => hero.toJSON()));
    //     } catch (e) {
    //         console.error('Insert error:', e);
    //     }
    // };

    return (
        <View style={styles.container}>
            <Text style={styles.timeText}>{formatTime(time)}</Text>
            <View style={styles.buttonContainer}>
                {running ? (
                    <TouchableOpacity
                        style={[styles.pauseButton]}
                        onPress={pauseStopwatch}>
                        <Text style={styles.buttonText}>Pause</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                    <TouchableOpacity
                            style={[styles.resetButton]}
                            onPress={resetStopwatch}>
                                
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                      <TouchableOpacity
                            style={[styles.startButton]}
                            onPress={StartStopwatch}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.startButton]}
                            onPress={saveTime}
                            disabled={time === 0}>
                            <Text style={styles.buttonText}>Save Time</Text>
                        </TouchableOpacity>
                    </>
                )}
                
            </View>
            <FlatList
                data={records}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={{ color: 'white', fontSize: 18, marginBottom: 5 }}>
                    {item.time}
                    </Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#2B2B2B",
    },
    timeText: {
        fontSize: 48,
        marginTop: 100,
        marginBottom: 50,
        color: "white",
    },
    buttonContainer: {
        flexDirection: 'column',
        marginTop: 0,
        height: "55%",
        marginBottom: 2,
        width: "100%",
    },
    startButton: {
        paddingVertical: 10,
        borderRadius: 5,
        paddingHorizontal: 20,
        backgroundColor: '#e74c3c',
        height: "35%",
    },
    resetButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#2ecc71',
        borderRadius: 5,
        height: "25%"
    },
    pauseButton: {
        height: "100%",
        paddingVertical: 10,
        borderRadius: 5,
        paddingHorizontal: 20,
        backgroundColor: '#f39c12',
    },
    buttonText: {
        marginVertical: "10%",
        color: 'white',
        fontSize: 50,
        textAlign: "center",
    },
});

export default App;