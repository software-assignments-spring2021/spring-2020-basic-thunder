import React from 'react';
import loading from "./img/loading.gif"

const LoadingView = ()=>{
  return (
    <div>
        <img src={loading} />
        <h1>Loading</h1>
        <h3>It may take a while to fetch your data. Hang tight!</h3>
    </div>
  )
};

export {LoadingView};
