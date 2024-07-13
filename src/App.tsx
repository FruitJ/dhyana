import React, { useEffect } from 'react';
import Base64 from './test';

const base64 = Base64.getInstance();
function App() {
  useEffect(() => {
    console.log(base64.encode('한국어'));
  }, []);
  return (
    <div>
      124
    </div>
  );
}

export default App;
