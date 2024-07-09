import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, username } = useContext(AuthContext);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/posts/${postId}`);
        setPost(response.data.post);
      } catch (error) {
        console.error('Failed to fetch post:', error.response?.data || error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/'); // Navigate to the root page after deleting the post
    } catch (error) {
      console.error('Failed to delete post:', error.response?.data || error.message);
    }
  };

  const handleEdit = async () => {
    try {
      // Navigate to edit page with postId as a URL parameter
      navigate(`/edit/${postId}`);
    } catch (error) {
      console.error('Failed to redirect to edit page:', error.response?.data || error.message);
    }
  };

  const handleGoBack = () => {
    navigate('/posts'); // Navigate back to posts
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      <p className="text-gray-700 mt-2">{post.content}</p>
      <small className="text-gray-500">By {post.author}</small>
      {isAuthenticated && username === post.author && (
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
      <div className="mt-4">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
