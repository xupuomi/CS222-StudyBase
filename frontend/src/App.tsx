import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import PostPage from './pages/postPage';
import HomePage from './pages/homePage';
import DisplayPost from './pages/displayPost';
import PostUploadSuccessPage from './pages/postSuccess';
import AddFavorite from './pages/addFavorite';
// import NavigationBar from './components/navigationBar';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container"> 
        <div className="content"> 
          <Routes>
            <Route path="/" element={<SignIn />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/posts" element={<PostPage />}></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/display" element={<DisplayPost />}></Route>
            <Route path="/add-favorite" element={<AddFavorite />}></Route>
            <Route path="/successful-upload" element={<PostUploadSuccessPage />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;