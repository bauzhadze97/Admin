import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDaily } from 'services/daily';


const MakeComment = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getDaily(id);
        setItem(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Item Details</h2>
      {item ? (
        <div>
          <p>ID: {item.id}</p>
          <p>Date: {item.date}</p>
          <p>Task Name: {item.name}</p>
          <p>Department: {item.user?.department?.name}</p>
          <p>Name: {item.user?.name}</p>
          {/* Render other details as needed */}
        </div>
      ) : (
        <p>No item found</p>
      )}
    </div>
  );
};

export default MakeComment;
