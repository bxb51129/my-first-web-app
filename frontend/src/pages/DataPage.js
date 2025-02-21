import React, { useEffect, useState } from 'react';

function DataPage() {
  const [data, setData] = useState([]); // 存储数据
  const [error, setError] = useState(''); // 错误信息

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Fetched data:', result);
        setData(result);
      } catch (err) {
        console.error('Failed to fetch data:', err.message);
        setError('Failed to fetch data. Please try again later.');
        setData([]); // 避免崩溃
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Data Page</h1>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <ul>
          {data.length > 0 ? (
            data.map((item, index) => (
              <li key={index}>{item.name || item}</li> // 假设每个 item 有 `name`
            ))
          ) : (
            <p>No data available</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default DataPage;
