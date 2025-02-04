

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Page/Home';
import Welcome from './Page/Welcome';
import Weather from './Component/Weather';

function App() {
   // */}
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Welcome/>}/>

          <Route path='/home' element={<Home/>}/>
          <Route path='/weather' element={<Weather/>}/>
        </Routes>
      </Router>
  )
}

export default App
