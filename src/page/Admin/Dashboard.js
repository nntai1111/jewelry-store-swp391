
import React, { useState } from 'react';
import axios from 'axios';
import P1 from './Dashboard/P1';
import P2 from './Dashboard/P2';
import P3 from './Dashboard/P3';

export default function Dashboard() {
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');
    // const [loading, setLoading] = useState(false);

    // const handleSubmit = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.post(`https://jssatsproject.azurewebsites.net/Metrics/csv/ExportChangeMetrics?startDate=${startDate}&endDate=${endDate}`, {}, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // Add any required headers (e.g., Authorization)
    //             },
    //             responseType: 'blob' // Important for handling binary data
    //         });

    //         // Create a URL for the file
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'Dashboard.csv'); // Set the file name
    //         document.body.appendChild(link);
    //         link.click();

    //         // Clean up and remove the link
    //         link.parentNode.removeChild(link);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         // Handle errors (e.g., display error message)
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <>
            {/* <div className="mt-4">
                <label className="block mb-2 text-sm font-bold text-gray-700">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                />

                <label className="block mt-2 mb-2 text-sm font-bold text-gray-700">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                />

                <button
                    className={`mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div> */}
            <div className="bg-white"><P1 /></div>
            <div className="bg-white"><P2 /></div>
            <div className="bg-white"><P3 /></div>
        </>
    );
}
