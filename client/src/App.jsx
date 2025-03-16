import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/posts");
    setPosts(res.data);
  };

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/search?query=${searchQuery}`);
    setPosts(res.data);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/posts", { title, content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPosts();
    } catch (err) {
      alert("Please login to post.");
      navigate("/login");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">⚔️CulChat⚔️</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search posts..."
          className="border rounded p-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >Search</button>
      </div>

      <form onSubmit={handlePostSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow">
        <input
          type="text"
          placeholder="Title"
          className="block w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="block w-full mb-2 p-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Post</button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500">By {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/login", { username, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    navigate("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="text" placeholder="Username" className="w-full p-2 border rounded" onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
};

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/signup", { username, password });
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input type="text" placeholder="Username" className="w-full p-2 border rounded" onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
