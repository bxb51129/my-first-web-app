import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DataTable() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch data:', err.message);
        setError('Failed to fetch data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;
