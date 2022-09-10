import React from 'react';
import NPApp from './components/container';
import axios from 'axios';
export default function App() {
  console.log(axios.defaults.headers.common);
  return <NPApp />;
}
