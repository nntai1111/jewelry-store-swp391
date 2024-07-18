
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChartCategory = () => {
    const [chartData, setChartData] = useState({
        series: [],
        labels: []
    });

    const [labelss, setLabelss] = useState(['1', '2'])


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(`https://jssatsproject.azurewebsites.net/api/Staff/getTop6ByMonth?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResult(data);

            if (data && data.data) {
                const seriesData = data.data.map(item => item.TotalRevenue);
                const labelsData = data.data.map(item => item.Firstname);

                setChartData({
                    series: seriesData,
                });
                setLabelss(labelsData)
                console.log('??? check chart', chartData)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleButtonClick = () => {
        setChartData(prevData => ({
            ...prevData,
            labels: labelss
        }));
        fetchData();
    };

    useEffect(() => {
        // Initial fetch of data when component mounts (if needed)
        fetchData();
    }, []); // Empty dependency array ensures this runs only once on mount
    const [options] = useState({
        chart: {
            type: 'donut',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        labels: chartData.labels
    });

    return (
        <div>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleButtonClick}>Fetch Data</button>
            </div>

            {/* Uncomment this section to display the fetched result if needed */}
            {/* {result && (
                <div>
                    <h2>Result:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )} */}

            <div id="chart">
                <ReactApexChart options={options} series={chartData.series} type="donut" />
            </div>
        </div>
    );
};

export default PieChartCategory;
