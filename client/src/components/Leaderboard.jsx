import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch leaderboard data from server
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/levels/leaderboard'); // Adjust the endpoint as needed
                setLeaderboard(response.data);
            } catch (err) {
                setError("Failed to load leaderboard data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLeaderboard();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Levels Finished</th>
                        <th>Latest Completion Time</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user.username}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.levelsFinished}</td>
                            <td>{user.latestTime ? new Date(user.latestTime).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
