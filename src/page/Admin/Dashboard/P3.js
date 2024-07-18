
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const P3 = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [dates, setDates] = useState([]);
    const [values, setValues] = useState([]);
    const [loadingApi, setLoadingApi] = useState(false);
    useEffect(() => {
        generateDates(year);
    }, [year]);

    const handleChange = (e) => {
        const selectedYear = parseInt(e.target.value, 10);
        setYear(selectedYear);
    };

    const generateDates = async (year) => {
        const monthDates = [];
        const fetchedValues = [];
        for (let month = 0; month < 12; month++) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0); // 0 gives the last day of the previous month
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            monthDates.push({
                month: startDate.toLocaleString('default', { month: 'long' }),
                startDate: formattedStartDate,
                endDate: formattedEndDate
            });
            setLoadingApi(true);
            // Fetch data from the API
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await axios.get(
                    `https://jssatsproject.azurewebsites.net/api/sellorder/SumTotalAmountOrderByDateTime?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const result = response.data && response.data.data ? response.data.data : 0;
                fetchedValues.push({
                    month: startDate.toLocaleString('default', { month: 'long' }),
                    value: result
                });
            } catch (error) {
                console.error(`Error fetching data for ${startDate.toLocaleString('default', { month: 'long' })}:`, error);
                fetchedValues.push({
                    month: startDate.toLocaleString('default', { month: 'long' }),
                    value: 'Error fetching data'
                });
            }
            setLoadingApi(false);
        }
        setDates(monthDates);
        setValues(fetchedValues);
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };
    const options = {
        series: [{
            name: 'Revenue',
            data: values.map(value => value.value !== 'Error fetching data' ? value.value : 0)
        }],
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return formatCurrency(val);
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        xaxis: {
            // categories: dates.map(date => date.month),
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return formatCurrency(val);
                }
            }
        },
        title: {
            text: `Total monthly revenue in ${year}`,
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        }
    };

    return (
        <div className='border border-gray-300 shadow-lg my-4 rounded-md '>
            <div class="flex justify-end ">
                <strong className='m-3'>Select Year: </strong>
                <input
                    type="number"
                    value={year}
                    className='my-3'
                    onChange={handleChange}
                    min="2000"
                    max="2050"
                    onKeyDown={(e) => {
                        // Allow only numeric keys, backspace, delete, arrow keys
                        if (!/[\d\b]|Arrow(?:Up|Down)/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />



            </div>
            <div className='flex justify-center'>
                {loadingApi && (
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className='fa-spin-pulse fa-spin-reverse fa-1.5x me-2 '
                    />
                )}
            </div>
            <div className=' p-6'>
                <Chart options={options} series={options.series} type="bar" height={350} />
            </div>
        </div>
    );
};

export default P3;
